import { useState, useEffect, useRef, useCallback } from 'react';
import OpenAI from 'openai';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { MainContainer, ChatContainer, MessageList, Message, MessageInput, TypingIndicator } from '@chatscope/chat-ui-kit-react';
import metadata from './assets/chat/metadata.json';
import './ChatComponent.css'; // Import the custom CSS file
import { useAddLog } from './Logger';

const gptModel = "gpt-4o";

const ChatComponent = ({ apiKey, visualizationObjects, chatActive, currentQuestion, datapointNum, guided, writingIntro, setWritingIntro, introducedVisualizations, setIntroducedVisualizations, recentlySelectedOption, setRecentlySelectedOption, goodQuestionCount, setGoodQuestionCount }) => {
  const [systemMessage, setSystemMessage] = useState('');
  const [fullSystemMessage, setFullSystemMessage] = useState('');
  const [messages, setMessages] = useState([{
    message: guided ? metadata["firstMessage"]["guided"] : metadata["firstMessage"]["chat"],
    direction: 'incoming',
    sender: "assistant"
  }]);
  const [apiMessages, setApiMessages] = useState([
    { "role": "assistant", "content": guided ? metadata["firstMessage"]["guided"] : metadata["firstMessage"]["chat"] },
  ]);
  const [sendMessage, setSendMessage] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const msgListRef = useRef(null);
  const [timeoutId, setTimeoutId] = useState(null);
  const [giveReminder, setGiveReminder] = useState(false);
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

  const handleInactivity = useCallback(() => {
    setGiveReminder(true);
  }, []);

  useEffect(() => {
    if (giveReminder && recentlySelectedOption) {
      setRecentlySelectedOption(false); // Reset this state after processing
      setMessages(prevMessages => [
        ...prevMessages,
        {
          message: "I can't give you answers to the quiz questions, but I can still help you out.",
          direction: 'incoming',
          sender: "assistant"
        }
      ]);
      resetInactivityTimer();
    }
  }, [giveReminder, recentlySelectedOption]);

  const resetInactivityTimer = () => {
    setGiveReminder(false); // Resetting reminder state
    if (timeoutId) {
      clearTimeout(timeoutId); // Clear the previous timer
    }
    const newTimeoutId = setTimeout(() => {
      handleInactivity(); // Triggers inactivity after 1 minute
    }, 60000); // 1 minute
    setTimeoutId(newTimeoutId); // Save new timeout ID
  };

  useEffect(() => {
    resetInactivityTimer(); // Start/reset timer on component mount

    // Clean up on unmount
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [handleInactivity]);

  const handleTyping = () => {
    resetInactivityTimer(); // Reset timer on user interaction
  };

  useEffect(() => {
    const constructFullSystemMessage = async () => {
      let updatedSystemMessage = systemMessage;

      if (guided) {
        updatedSystemMessage = updatedSystemMessage.replace("...", metadata["guided"]);
        updatedSystemMessage = updatedSystemMessage.replace("[PARTING]", metadata["parting"]["guided"])
      } else {
        updatedSystemMessage = updatedSystemMessage.replace("[PARTING]", metadata["parting"]["chat"])
      }

      //let addendum = "\n\n" + metadata["prequestions"] + "\n\n";

      setFullSystemMessage(updatedSystemMessage);// + addendum + questions);
    };

    constructFullSystemMessage();
  }, [systemMessage]);

  // useEffect(() => {
  //   if (chatActive) {
  //     handleSend("");
  //   }
  // }, [chatActive]);

  useEffect(() => {
    if (!chatActive) {
      return;
    }
    const fetchGPTResponse = async () => {
      setIsTyping(true);
      resetInactivityTimer();
      let response = await sendMessageToGPT(apiMessages);
      await streamResponseToChat(response, [...messages]);
      setIsTyping(false);
    };
    fetchGPTResponse();
  }, [sendMessage]);

  const handleSend = async (message) => {
    if (message) {
      const newMessage = {
        message,
        direction: 'outgoing',
        sender: "user"
      };
      addLog('Sent ' + message);

      setMessages(messages => [...messages, newMessage]);
    }

    let imageToEncode;
    let activeVisualization = visualizationObjects.visualizations[visualizationObjects.activeVisualization];

    if (!activeVisualization) {
      try {
        setApiMessages([...apiMessages, {
          role: "user",
          content: [
            { type: "text", text: "'''SPECIAL MESSAGE: the user is trying to converse before selecting a visualization. Tell them how to select a visualization!'''" + message },
          ],
        }]);
        setSendMessage(sendMessage + 1);
      } catch (error) {
        console.error("Error in handleSend:", error);
      }
      return;
    }

    if ("subVisualizations" in activeVisualization) {
      imageToEncode = activeVisualization.subVisualizations[activeVisualization.activeSubVisualization];
    } else {
      imageToEncode = activeVisualization.module;
    }

    const base64 = await encodeImage(imageToEncode);

    // for local visualizations, specify which datapoint it corresponds to for gpt
    let visualizationNameForGPT = activeVisualization.name;
    if (!activeVisualization.global) {
      visualizationNameForGPT += " (data point " + datapointNum.toString() + ")";
    }

    if ("subVisualizations" in activeVisualization) {
      visualizationNameForGPT += " " + activeVisualization.activeSubVisualization;
    }

    if (guided && message) {
      for (const connection in activeVisualization.connections) {
        visualizationNameForGPT += " [" + connection + "]"
      }
    }

    const questionPart = currentQuestion ? "<<<" + currentQuestion + ">>>" : "";

    try {
      setApiMessages([...apiMessages, {
        role: "user",
        content: [
          { type: "text", text: "'''" + visualizationNameForGPT + "'''" + questionPart + message },
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
      setApiMessages([...apiMessages, { role: "assistant", content: stream }]);

      if (stream.includes("[GOOD_QUESTION]")) {
        setGoodQuestionCount(goodQuestionCount + 1);
      }
      stream = stream.replaceAll("[GOOD_QUESTION]", "");

      if (writingIntro) {
        stream += "\n\nRecommended question: " + visualizationObjects.visualizations[visualizationObjects.activeVisualization].question;
      }

      if (guided && (stream.includes("[RECOMMEND]") || writingIntro)) {
        stream = stream.replaceAll("[RECOMMEND]", "");

        if (stream) {
          stream += "\n\n";
        }
        stream += "If you're ready to view another explanation, I recommend the:"

        const currentConnections = visualizationObjects.visualizations[visualizationObjects.activeVisualization].connections;
        stream += "<ul>";
        for (const connection in currentConnections) {
          stream += "<li><b>" + connection + "</b> " + currentConnections[connection].replace("[X]", "(data point " + datapointNum.toString() + ")") + "</li>";

          if (!introducedVisualizations.includes(connection)) {
            setIntroducedVisualizations(oldArray => [...oldArray, connection]);
          }
        }
        stream += "</ul>";
      }

      setMessages([...chatMessages, {
        message: stream,
        direction: 'incoming',
        sender: "assistant"
      }]);
      setWritingIntro(false);
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
      callback(aspectRatio > 1.5); // true if width >> height, meaning the image is wide
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
        const newMessages = [{
          payload: {
            src: imageToSend,
            width: isWide ? "55vw" : "100%",
            height: isWide ? "100%" : "60vh"
          },
          type: 'image',
          direction: 'outgoing',
          sender: "user"
        }];

        if (giveReminder) {
          newMessages.push({
            message: "Let me know if you have any questions.",
            direction: 'incoming',
            sender: "assistant"
          });
        }
        resetInactivityTimer();
        setMessages([...messages, ...newMessages]);
      });
    }
    if (visualizationObjects.activeVisualization) {
      showVisualization();
    }
  }, [visualizationObjects.visualizations[visualizationObjects.activeVisualization]]);

  useEffect(() => {
    const explainVisualization = async () => {
      setWritingIntro(true);
      resetInactivityTimer();
      handleSend("");
    }
    if (visualizationObjects.activeVisualization && visualizationObjects.visualizations[visualizationObjects.activeVisualization].visited) {
      explainVisualization();
    }
  }, [visualizationObjects.visualizations[visualizationObjects.activeVisualization]?.visited]);

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <MainContainer style={{ width: "100%", height: "100%" }}>
        <ChatContainer>
          <MessageList
            scrollBehavior="auto"
            ref={msgListRef}
            typingIndicator={isTyping ? <TypingIndicator content="XAI Assistant is typing" /> : null}
          >
            {messages.map((message, i) => (
              <Message key={i} model={message} />
            ))}
          </MessageList>
          <MessageInput disabled={isTyping} placeholder="Type message here" onSend={handleSend} onChange={handleTyping} />
        </ChatContainer>
      </MainContainer>
    </div>
  );
};

export default ChatComponent;