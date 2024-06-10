import { useState, useEffect, useRef } from 'react';
import OpenAI from 'openai';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { MainContainer, ChatContainer, MessageList, Message, MessageInput, TypingIndicator } from '@chatscope/chat-ui-kit-react';
import metadata from './assets/metadata.json';
import VisualizationRenderer from './VisualizationRenderer';
import './ChatComponent.css'; // Import the custom CSS file

const gptModel = "gpt-4o";

const ChatComponent = ({ apiKey, setExplanation, messageInputEnabled, setMessageInputEnabled, setTestKeyFunc, setKeyColor, datapointPath }) => {
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
  const [currentVisualizationPath, setCurrentVisualizationPath] = useState(null);

  useEffect(() => {
    setExplanation(() => explainVisualization);
  }, [setExplanation, messages]);

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

    fetchExplanations();
  }, [datapointPath]);

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
      setIsTyping(false);
    }
  };

  const sendMessageToGPT = async (messages) => {
    // console.log(messages);

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
    setIsTyping(false);
  };

  const explainVisualization = async (index) => {
    setMyState(index);

    setIsTyping(true);
    try {
      if (currentVisualizationPath && currentVisualizationPath.endsWith('.png')) {
        setApiMessages([...apiMessages, {
          role: "user",
          content: [
            { type: "text", text: "'''" + explanations[index] + "'''" },
            { type: "image_url", image_url: { url: currentVisualizationPath } }
          ]
        }]);
      } else {
        setApiMessages([...apiMessages, {
          role: "system",
          content: "'''" + explanations[index] + "'''"
        }]);
      }
      setSendMessage(sendMessage + 1);
    } catch (error) {
      console.error("Error in explainVisualization:", error);
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
        <VisualizationRenderer parentState={myState} datapointPath={datapointPath} setCurrentVisualizationPath={setCurrentVisualizationPath} defaultMessage={"Submit your GPT key in the upper left corner, and then click on the explanations to the left to help understand the model's prediction. Use the conversation interface to help understand the explanations"} />
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