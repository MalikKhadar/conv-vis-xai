import { useState, useEffect } from 'react';
import OpenAI from 'openai';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { MainContainer, ChatContainer, MessageList, Message, MessageInput, TypingIndicator } from '@chatscope/chat-ui-kit-react';
import modelInfo from './assets/modelInfo.json';
import VisualizationRenderer from './VisualizationRenderer';

const gptModel = "gpt-4o";

const ChatComponent = ({ apiKey, setExplanation, messageInputEnabled, setMessageInputEnabled, setTestKeyFunc, setKeyColor }) => {
  const [isTyping, setIsTyping] = useState(false);
  const [systemMessage, setSystemMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      message: modelInfo["firstMessage"],
      sentTime: "just now",
      direction: "incoming",
      sender: "assistant"
    }
  ]);
  const [myState, setMyState] = useState(-1);

  useEffect(() => {
    setExplanation(() => explainVisualization);
  }, [setExplanation, messages]);

  useEffect(() => {
    const fetchSystemMessage = async () => {
      try {
        let response = await fetch('src/assets/systemMessage.txt');
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
      return { role: messageObject.sender, content: messageObject.message };
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
            sender: "assistant"
          }]);
        }
      }
    } catch (error) {
      console.error("Error while processing response:", error);
    }
  };

  const explainVisualization = async (index) => {
    setMyState(index);

    const newMessage = {
      message: "'''" + modelInfo.explanations[index].message + "'''",
      direction: 'outgoing',
      sender: "system"
    };

    setIsTyping(true);
    try {
      let processedMessages = await processMessagesToGPT([...messages, newMessage]);
      let response = await sendMessageToGPT(processedMessages);
      await streamResponseToChat(response, messages);
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
    <div style={{ height: "100%" }}>
      <div style={{ display: "flex", height: "70%", width: "100%", alignContent: "center" }}>
        <VisualizationRenderer parentState={myState} defaultMessage={"Submit your GPT key in the upper left corner, and then click on the explanations to the left to help understand the model's prediction. Use the conversation interface to help understand the explanations"} />
      </div>
      <MainContainer style={{height: "30%"}}>
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
