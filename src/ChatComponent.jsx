import { useState, useEffect } from 'react';
import OpenAI from 'openai';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { MainContainer, ChatContainer, MessageList, Message, MessageInput, TypingIndicator } from '@chatscope/chat-ui-kit-react';
import modelInfo from './modelInfo.json';

const gptModel = "gpt-4o";

const ChatComponent = ({ apiKey, setExplanation, messageInputEnabled, setMessageInputEnabled, setTestKeyFunc, setKeyColor }) => {
  const [isTyping, setIsTyping] = useState(false);
  const [systemMessage, setSystemMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      message: modelInfo["firstMessage"],
      sentTime: "just now",
      direction: "incoming",
      sender: "GPT"
    }
  ]);
  const [imageSrc, setImageSrc] = useState(modelInfo.explanations[0].visualization);

  useEffect(() => {
    const fetchSystemMessage = async () => {
      try {
        let response = await fetch('/MalikKhadar/con-vis-xai/src/systemMessage.txt');
        let text = await response.text();
        setSystemMessage(text);
      } catch (error) {
        console.error('Error fetching the file:', error);
      }
    };

    fetchSystemMessage();
  }, []);

  useEffect(() => {
    setTestKeyFunc(() => testKey);
    setExplanation(() => explainVisualization);
  }, [apiKey, setTestKeyFunc, setExplanation]);

  const handleSend = async (message) => {
    const newMessage = {
      message,
      direction: 'outgoing',
      sender: "user"
    };

    setMessages(messages => [...messages, newMessage]);

    setIsTyping(true);
    try {
      let processedMessages = await processMessagesToGPT([...messages, newMessage]);
      let response = await sendMessageToGPT(processedMessages);
      await streamResponseToChat(response, [...messages, newMessage]);
    } catch (error) {
      console.error("Error in handleSend:", error);
    } finally {
      setIsTyping(false);
    }
  };

  const processMessagesToGPT = async (chatMessages) => {
    let apiMessages = chatMessages.map((messageObject) => {
      let role = (messageObject.sender === "GPT") ? "assistant" : "user";
      if (messageObject.type !== "image") {
        return { role, content: messageObject.message };
      } else {
        return { role, content: "*The user sends an image of a visualization*" };
      }
    });

    return apiMessages;
  };

  const sendMessageToGPT = async (apiMessages) => {
    const apiRequestBody = {
      "model": gptModel,
      "messages": [
        { "role": "system", "content": systemMessage },
        ...apiMessages
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
            sender: "GPT"
          }]);
        }
      }
    } catch (error) {
      console.error("Error while processing response:", error);
    }
  };

  // const explainVisualization = async (index) => {
  //   const visualization = {
  //     type: "image",
  //     direction: 'outgoing',
  //     sender: "user",
  //     payload: { src: modelInfo.explanations[index].visualization, height: "80vh" }
  //   };

  //   setMessages(messages => [...messages, visualization]);

  //   const newMessage = {
  //     message: "'''" + modelInfo.explanations[index].message + "'''",
  //     direction: 'outgoing',
  //     sender: "system"
  //   };

  //   setIsTyping(true);
  //   try {
  //     let processedMessages = await processMessagesToGPT([...messages, newMessage]);
  //     let response = await sendMessageToGPT(processedMessages);
  //     await streamResponseToChat(response, [...messages, visualization]);
  //   } catch (error) {
  //     console.error("Error in explainVisualization:", error);
  //   } finally {
  //     setIsTyping(false);
  //   }
  // };

  const explainVisualization = async (index) => {
    setImageSrc(modelInfo.explanations[index].visualization);

    const newMessage = {
      message: "'''" + modelInfo.explanations[index].message + "'''",
      direction: 'outgoing',
      sender: "system"
    };

    setIsTyping(true);
    try {
      let processedMessages = await processMessagesToGPT([...messages, newMessage]);
      let response = await sendMessageToGPT(processedMessages);
      await streamResponseToChat(response, [...messages]);
    } catch (error) {
      console.error("Error in explainVisualization:", error);
    } finally {
      setIsTyping(false);
    }
  };

  const testKey = async () => {
    try {
      let sentStatus = await sendMessageToGPT([{ role: "user", content: "test" }]);
      if (sentStatus) {
        setMessageInputEnabled(true);
        setKeyColor("#ffffff");
      } else {
        setMessageInputEnabled(false);
        setKeyColor("#ff6961");
      }
    } catch (error) {
      console.error("Error in testKey:", error);
      setMessageInputEnabled(false);
      setKeyColor("#ff6961");
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <div style={{ height: "60vh", width: "100%", alignContent: "center" }}>
        <img src={imageSrc} style={{ maxHeight: "100%", maxWidth: "100%" }} />
      </div>
      <MainContainer style={{ height: "40vh" }}>
        <ChatContainer>
          <MessageList
            scrollBehavior="auto"
            typingIndicator={isTyping ? <TypingIndicator content="ExplainoBot is typing" /> : null}
          >
            {messages.map((message, i) => (
              <Message key={i} model={message} />
            ))}
          </MessageList>
          <MessageInput disabled={!messageInputEnabled} placeholder="Type message here" onSend={handleSend} />
        </ChatContainer>
      </MainContainer>
    </div>
  );
};

export default ChatComponent;
