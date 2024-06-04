import { useState, useEffect, useRef } from 'react';
import OpenAI from 'openai';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { MainContainer, ChatContainer, MessageList, Message, MessageInput, TypingIndicator } from '@chatscope/chat-ui-kit-react';
import metadata from './assets/datapoint/metadata.json';
import VisualizationRenderer from './VisualizationRenderer';

const gptModel = "gpt-4o";

const ChatComponent = ({ apiKey, setExplanation, messageInputEnabled, setMessageInputEnabled, setTestKeyFunc, setKeyColor }) => {
  const [isTyping, setIsTyping] = useState(false);
  const [systemMessage, setSystemMessage] = useState('');
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
  const [myState, setMyState] = useState(-1);
  const [sendMessage, setSendMessage] = useState(0);
  const isFirstRender = useRef(true);
  const [explanations, setExplanations] = useState([]);

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
        let response = await fetch('https://raw.githubusercontent.com/MalikKhadar/conv-vis-xai/main/src/assets/systemMessage.txt');
        let text = await response.text();
        setSystemMessage(text);
      }
    };

    fetchSystemMessage();
  }, []);

  useEffect(() => {
    const fetchExplanations = async () => {
      const folderPath = 'src/assets/datapoint/';
      const fallbackFolderPath = 'https://raw.githubusercontent.com/MalikKhadar/conv-vis-xai/main/src/assets/datapoint/';
      const numberOfExplanations = 3; // Adjust this to the actual number of explanation files you have

      const fetchedExplanations = [];

      for (let i = 0; i < numberOfExplanations; i++) {
        try {
          let response = await fetch(`${folderPath}${i}.txt`);
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          let text = await response.text();
          fetchedExplanations.push(text);
        } catch (error) {
          try {
            let response = await fetch(`${fallbackFolderPath}${i}.txt`);
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            let text = await response.text();
            fetchedExplanations.push(text);
          } catch (fallbackError) {
            console.error(`Failed to fetch explanation ${i}.txt from both primary and fallback locations.`, fallbackError);
          }
        }
      }

      setExplanations(fetchedExplanations);
    };

    fetchExplanations();
  }, []);

  useEffect(() => {
    setTestKeyFunc(() => testKey);
    setExplanation(() => explainVisualization);
  }, [apiKey, setTestKeyFunc, setExplanation]);

  useEffect(() => {
    if (isFirstRender.current || apiKey == "") {
      isFirstRender.current = false;
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

    setMessages(messages => [...messages, newMessage]);

    setIsTyping(true);
    try {
      setApiMessages([...apiMessages, { role: "user", content: message }]);
      setSendMessage(sendMessage + 1);
    } catch (error) {
      console.error("Error in handleSend:", error);
    } finally {
      setIsTyping(false);
    }
  };

  const sendMessageToGPT = async (messages) => {
    console.log(messages);
    const apiRequestBody = {
      "model": gptModel,
      "messages": [
        { "role": "system", "content": systemMessage },
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
    } catch (error) {
      console.error("Error while processing response:", error);
    }
  };

  const explainVisualization = async (index) => {
    setMyState(index);

    setIsTyping(true);
    try {
      setApiMessages([...apiMessages, { role: "system", content: "'''" + explanations[index] + "'''" }]);
      setSendMessage(sendMessage + 1);
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
      <MainContainer style={{ height: "30%" }}>
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