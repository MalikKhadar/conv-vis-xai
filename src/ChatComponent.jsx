import { useState, useEffect, useRef } from 'react';
import OpenAI from 'openai';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { MainContainer, ChatContainer, MessageList, Message, MessageInput, TypingIndicator } from '@chatscope/chat-ui-kit-react';
import metadata from './assets/metadata.json';
import './ChatComponent.css'; // Import the custom CSS file
import QuickReplies from './QuickReplies';
import { useAddLog } from './Logger';

const gptModel = "gpt-4o";

const ChatComponent = ({ apiKey, setVisualizationState, visualizationState, datapointPath, chatActive, questions }) => {
  const [isTyping, setIsTyping] = useState(false);
  const [systemMessage, setSystemMessage] = useState('');
  const [fullSystemMessage, setFullSystemMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      message: metadata["firstMessage"],
      sentTime: "just now",
      direction: "incoming",
      sender: "assistant"
    }
  ]);
  const [apiMessages, setApiMessages] = useState([
    { "role": "assistant", "content": metadata["firstMessage"] },
  ]);
  const [sendMessage, setSendMessage] = useState(0);
  const [explanations, setExplanations] = useState([]);
  const [visualizations, setVisualizations] = useState([]);
  const [clickedReply, setClickedReply] = useState(false);
  const msgListRef = useRef(null);
  const addLog = useAddLog();

  useEffect(() => {
    const fetchSystemMessage = async () => {
      const systemMessageFiles = import.meta.glob('/src/assets/systemMessage.txt');
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
    const fetchExplanations = async () => {
      const allFiles = import.meta.glob('/src/assets/datapoints/**/explanations/*.txt');
      const fetchedExplanations = [];

      for (const path in allFiles) {
        if (path.includes(datapointPath)) {
          try {
            const file = allFiles[path];
            const module = await file();
            const response = await fetch(module.default);
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            const text = await response.text();
            fetchedExplanations.push(text);
          } catch (error) {
            console.error(`Failed to fetch explanation from ${path}.`, error);
          }
        }
      }
      setExplanations(fetchedExplanations);
    };
    const fetchVisualizations = async () => {
      // Only keep the files that match our visualization path
      const allVisualizations = import.meta.glob('/src/assets/datapoints/**/visualizations/*.{json,png}');
      const loadedVisualizations = [];

      for (const path in allVisualizations) {
        // filter out irrelevant assets and the notes
        if (path.includes(datapointPath) && !path.includes("notes")) {
          const module = await allVisualizations[path]();
          const index = path.match(/\/(\d+)\.[json|png]+$/)[1];
          loadedVisualizations[index] = { path, module: module.default || module };
        }
      }

      setVisualizations(loadedVisualizations);
    };
    fetchVisualizations();
    fetchExplanations();
    setMessages([
      {
        message: metadata["firstMessage"],
        sentTime: "just now",
        direction: "incoming",
        sender: "assistant"
      }
    ]);
  }, [datapointPath]);

  useEffect(() => {
    if (!chatActive) {
      return;
    }
    const fetchGPTResponse = async () => {
      let response = await sendMessageToGPT(apiMessages);
      await streamResponseToChat(response, [...messages]);
    };
    fetchGPTResponse();
  }, [sendMessage]);

  const handleSend = async (message) => {
    const newMessage = {
      message,
      direction: 'outgoing',
      sender: "user"
    };
    addLog('Sent ' + message);

    setMessages(messages => [...messages, newMessage]);

    // setIsTyping(true);
    try {
      setApiMessages([...apiMessages, { role: "user", content: message }]);
      setSendMessage(sendMessage + 1);
    } catch (error) {
      console.error("Error in handleSend:", error);
      // setIsTyping(false);
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
      setApiMessages([...apiMessages, { role: "assistant", content: stream }]);
      addLog('Reply ' + stream);
    } catch (error) {
      console.error("Error while processing response:", error);
    }
    // setIsTyping(false);
  };

  const encodeImage = async (imagePath) => {
    const imageFiles = import.meta.glob('/src/assets/datapoints/**/visualizations/*.png');

    if (imageFiles[imagePath]) {
      const module = await imageFiles[imagePath]();
      const response = await fetch(module.default);

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
    } else {
      throw new Error('Image not found');
    }
  };

  // useEffect(() => {
  //   const explainVisualization = async () => {
  //     if (!chatActive) {
  //       return;
  //     }
      // setIsTyping(true);
  //     try {
  //       if (visualizations[visualizationState].path.endsWith('.png')) {
  //         const base64 = await encodeImage(visualizations[visualizationState].path);

  //         setApiMessages([...apiMessages, {
  //           role: "user",
  //           content: [
  //             { type: "text", text: "'''" + explanations[visualizationState] + "'''" },
  //             { type: "image_url", image_url: { url: "data:image/png;base64," + base64 } }
  //           ]
  //         }]);
  //       } else {
  //         setApiMessages([...apiMessages, {
  //           role: "system",
  //           content: "'''" + explanations[visualizationState] + "'''"
  //         }]);
  //       }
  //       setSendMessage(sendMessage + 1);
  //     } catch (error) {
  //       console.error("Error in explainVisualization:", error);
  //       setIsTyping(false);
  //     }
  //   }
  //   explainVisualization();
  // }, [visualizationState, chatActive, visualizations]);

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

  useEffect(() => {
    const showVisualization = async () => {
      // if (!chatActive) {
      //   return;
      // }
      setMessages([...messages, {
        payload: {
          src: visualizations[visualizationState].module
        },
        type: 'image',
        direction: 'incoming',
        sender: "assistant"
      }]);
      setClickedReply(!clickedReply);
    }
    showVisualization();
  }, [visualizationState, visualizations]);

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
              <div key={i}>
                <Message model={message} />
                {i === messages.length - 1 && (
                  <QuickReplies
                    datapointPath={datapointPath}
                    setVisualizationState={setVisualizationState}
                    visualizationState={visualizationState}
                  />
                )}
              </div>
            ))}
          </MessageList>
          <MessageInput placeholder="Type message here" onSend={handleSend} />
        </ChatContainer>
      </MainContainer>
    </div>
  );
};

export default ChatComponent;