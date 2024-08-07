import { useState, useEffect, useRef } from 'react';
import OpenAI from 'openai';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { MainContainer, ChatContainer, MessageList, Message, MessageInput, TypingIndicator } from '@chatscope/chat-ui-kit-react';
import metadata from './assets/chat/metadata.json';
import './ChatComponent.css'; // Import the custom CSS file
import { useAddLog } from './Logger';

const gptModel = "gpt-4o";

const ChatComponent = ({ apiKey, visualizationObjects, chatActive, questions, datapointNum, guided, introducedVisualizations, setIntroducedVisualizations }) => {
  const [systemMessage, setSystemMessage] = useState('');
  const [fullSystemMessage, setFullSystemMessage] = useState('');
  // const [messages, setMessages] = useState([
  //   {
  //     message: metadata["firstMessage"],
  //     sentTime: "just now",
  //     direction: "incoming",
  //     sender: "assistant"
  //   }
  // ]);
  const [messages, setMessages] = useState([]);
  const [apiMessages, setApiMessages] = useState([
    { "role": "assistant", "content": metadata["firstMessage"] },
  ]);
  const [sendMessage, setSendMessage] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const msgListRef = useRef(null);
  const addLog = useAddLog();

  useEffect(() => {
    const fetchSystemMessage = async () => {
      const systemMessageFiles = import.meta.glob('/src/assets/chat/systemMessage.txt');
      const systemMessagePaths = Object.keys(systemMessageFiles);

      if (systemMessagePaths.length === 0) {
        console.error("No system message files found.");
        return;
      }

      for (const path of systemMessagePaths) {
        try {
          const module = await systemMessageFiles[path]();
          const response = await fetch(module.default);
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          const text = await response.text();
          setSystemMessage(text);
          // Once you found and set the system message, you can break the loop
          break;
        } catch (error) {
          console.error(`Failed to fetch system message from ${path}.`, error);
        }
      }
    };

    fetchSystemMessage();
  }, []);

  useEffect(() => {
    const constructFullSystemMessage = async () => {
      let addendum = "\n\nLastly, here are the questions we'll be displaying to the user. If the user asks any of these questions, or any question equivalent to these questions, tell them 'I cannot answer quiz questions for you.' Questions:\n\n";
      setFullSystemMessage(systemMessage + addendum + questions);
    };

    constructFullSystemMessage();
  }, [systemMessage, questions]);

  useEffect(() => {
    if (chatActive) {
      // const newMessage = {
      //   message: metadata["firstMessage"],
      //   direction: 'incoming',
      //   sender: "assistant"
      // };
      // setMessages(messages => [...messages, newMessage]);
      handleSend("");
    }
  }, [chatActive]);

  useEffect(() => {
    if (!chatActive) {
      return;
    }
    const fetchGPTResponse = async () => {
      setIsTyping(true);
      let response = await sendMessageToGPT(apiMessages);
      await streamResponseToChat(response, [...messages]);
      setIsTyping(false);
    };
    fetchGPTResponse();
  }, [sendMessage]);

  const handleSend = async (message) => {
    let imageToEncode;
    let activeVisualization = visualizationObjects.visualizations[visualizationObjects.activeVisualization];

    if ("subVisualizations" in activeVisualization) {
      imageToEncode = activeVisualization.subVisualizations[activeVisualization.activeSubVisualization];
    } else {
      imageToEncode = activeVisualization.module;
    }

    const base64 = await encodeImage(imageToEncode);

    if (message) {
      const newMessage = {
        message,
        direction: 'outgoing',
        sender: "user"
      };
      addLog('Sent ' + message);

      setMessages(messages => [...messages, newMessage]);
    }

    // for local visualizations, specify which datapoint it corresponds to for gpt
    let visualizationNameForGPT = activeVisualization.name;
    if (!activeVisualization.global) {
      visualizationNameForGPT += " " + datapointNum.toString();
    }

    if ("subVisualizations" in activeVisualization) {
      visualizationNameForGPT += " " + activeVisualization.activeSubVisualization;
    }

    if (guided && message) {
      visualizationNameForGPT += ": " + activeVisualization.connectionText;
    }

    try {
      setApiMessages([...apiMessages, {
        role: "user",
        content: [
          { type: "text", text: "'''" + visualizationNameForGPT + "'''" + message },
          { type: "image_url", image_url: { url: "data:image/png;base64," + base64 } }
        ],
      }]);
      setSendMessage(sendMessage + 1);
    } catch (error) {
      console.error("Error in handleSend:", error);
    }
  };

  const sendMessageToGPT = async (messages) => {
    const apiRequestBody = {
      "model": gptModel,
      "messages": [
        { "role": "system", "content": fullSystemMessage },
        ...messages
      ],
      "stream": true
    };

    try {
      const openai = new OpenAI({
        apiKey: apiKey,
        dangerouslyAllowBrowser: true
      });
      let response = await openai.chat.completions.create(apiRequestBody);
      return response;
    } catch (error) {
      console.error("Error sending message to GPT:", error);
      return null;
    }
  };

  const streamResponseToChat = async (response, chatMessages) => {
    if (!response) {
      console.log("Error: Failed to get a response.");
      return;
    }

    try {
      let stream = "";
      for await (const part of response) {
        let newContent = part.choices[0].delta.content;

        if (newContent) {
          stream += newContent;
          setMessages([...chatMessages, {
            message: stream,
            direction: 'incoming',
            sender: "assistant"
          }]);
        }
      }
      const currentConnections = visualizationObjects.visualizations[visualizationObjects.activeVisualization].connections;
      for (const connection in currentConnections) {
        if (!introducedVisualizations.includes(currentConnections[connection])) {
          if (stream.includes(currentConnections[connection])) {
            setIntroducedVisualizations(oldArray => [...oldArray, currentConnections[connection]]);
          }
        }
      }

      setApiMessages([...apiMessages, { role: "assistant", content: stream }]);
      addLog('Reply ' + stream);
    } catch (error) {
      console.error("Error while processing response:", error);
    }
  };

  const encodeImage = async (visualizationImage) => {
    const response = await fetch(visualizationImage);

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result.split(',')[1]);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  useEffect(() => {
    function sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }

    const scrollDown = async () => {
      await sleep(20);
      msgListRef.current?.scrollToBottom("auto");
    }
    scrollDown();
  }, [messages])

  // Function to check if an image is wide
  const isImageWide = (imageUrl, callback) => {
    const img = new Image();
    img.onload = () => {
      const aspectRatio = img.width / img.height;
      callback(aspectRatio > 2); // true if width >> height, meaning the image is wide
    };
    img.src = imageUrl;
  };

  useEffect(() => {
    const showVisualization = async () => {
      let imageToSend;
      let activeVisualization = visualizationObjects.visualizations[visualizationObjects.activeVisualization];

      if ("subVisualizations" in activeVisualization) {
        imageToSend = activeVisualization.subVisualizations[activeVisualization.activeSubVisualization];
      } else {
        imageToSend = activeVisualization.module;
      }

      isImageWide(imageToSend, (isWide) => {
        const newMessage = {
          payload: {
            src: imageToSend,
            width: isWide ? "55vw" : "100%",
            height: isWide ? "100%" : "60vh"
          },
          type: 'image',
          direction: 'outgoing',
          sender: "user"
        };

        if (activeVisualization.visited) {
          setMessages([...messages, newMessage]);
        } else {
          handleSend("");
        }
      });
    }
    if (visualizationObjects.activeVisualization) {
      showVisualization();
    }
  }, [visualizationObjects.visualizations[visualizationObjects.activeVisualization]]);

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <MainContainer style={{ width: "100%", height: "100%" }}>
        <ChatContainer>
          <MessageList
            scrollBehavior="auto"
            ref={msgListRef}
            typingIndicator={isTyping ? <TypingIndicator content="ExplainoBot is typing" /> : null}
          >
            {messages.map((message, i) => (
              <Message key={i} model={message} />
            ))}
          </MessageList>
          <MessageInput placeholder="Type message here" onSend={handleSend} />
        </ChatContainer>
      </MainContainer>
    </div>
  );
};

export default ChatComponent;