import { useState } from 'react'
import './App.css'
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import QuizComponent from './QuizComponent';
import ExplanationButtons from './ExplanationButtons';
import ChatComponent from './ChatComponent';
import KeyComponent from './KeyComponent';
import NoChatComponent from './NoChatComponent';

function App() {
  const [explanation, setExplanation] = useState(() => { });
  const [testKeyFunc, setTestKeyFunc] = useState(() => { });

  // Dynamic key variable
  const [key, setKey] = useState("You still need to provide a key");
  const changeKey = event => {
    setKey(event.target.value);
  }

  const [keyColor, setKeyColor] = useState("#ffffff");
  const [messageInputEnabled, setMessageInputEnabled] = useState(false);

  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  let chatInterface = false;
  if (urlParams.has('chat')) {
    chatInterface = true;
  }

  return (
    <div className="App" style={{ display: 'flex', height: "100vh", width: "100%" }}>
      <div style={{ flex: "0 3 100%" }}>
        {chatInterface ? <KeyComponent
          apiKey={key}
          keyColor={keyColor}
          testKeyFunc={testKeyFunc}
          changeKey={changeKey}
          messageInputEnabled={messageInputEnabled}
        /> : null}
        <ExplanationButtons buttonsEnabled={messageInputEnabled || !chatInterface} showExplanation={explanation} />
        {/* <div style={{ marginTop: "100px" }}>
          <QuizComponent />
        </div> */}
      </div>

      <div style={{ flex: "10 1.4 100%" }}>
        {chatInterface ? <ChatComponent
          apiKey={key}
          setExplanation={setExplanation}
          messageInputEnabled={messageInputEnabled}
          setMessageInputEnabled={setMessageInputEnabled}
          setKeyColor={setKeyColor}
          setTestKeyFunc={setTestKeyFunc}
        /> : <NoChatComponent setExplanation={setExplanation} />}
      </div>
      <div style={{ flex: "0 3 100%" }}>
        <QuizComponent />
      </div>
    </div>
  );
}

export default App