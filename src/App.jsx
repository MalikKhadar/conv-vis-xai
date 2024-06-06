import { useState } from 'react'
import './App.css'
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import QuizComponent from './QuizComponent';
import ExplanationButtons from './ExplanationButtons';
import ChatComponent from './ChatComponent';
import KeyComponent from './KeyComponent';
import NoChatComponent from './NoChatComponent';
import PredictionDisplay from './PredictionDisplay';
import TutorialPage from './TutorialPage';

function App() {
  const [explanation, setExplanation] = useState(() => { });
  const [testKeyFunc, setTestKeyFunc] = useState(() => { });
  const [finishedTutorial, setFinishedTutorial] = useState(false);
  const handleFinishTutorial = () => {
    setFinishedTutorial(true);
  };

  // Dynamic key variable
  const [key, setKey] = useState("");
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

  if (!finishedTutorial) {
    return (
      <div>
        <TutorialPage />
        <div style={{display: "flex", justifyContent: "center", alignItems: "center" }}>
          <button onClick={handleFinishTutorial} style={{marginBottom: "10px"}}>Begin</button>
        </div>
      </div >
    )
  }

  return (
    <div className="App" style={{ display: 'flex', gap: '5px', height: "100vh", width: "99.5%", margin: "auto" }}>
      <div style={{ display: 'flex', flexDirection: 'column', flex: "1", height: "100vh", maxWidth: "20vw", overflowY: "hidden" }}>
        {chatInterface && !messageInputEnabled ? <KeyComponent
          apiKey={key}
          keyColor={keyColor}
          testKeyFunc={testKeyFunc}
          changeKey={changeKey}
          messageInputEnabled={messageInputEnabled}
          style={{ flex: "1 0" }}
        /> : null}
        <ExplanationButtons buttonsEnabled={messageInputEnabled || !chatInterface} showExplanation={explanation} style={{ flex: "1" }} />
      </div>

      <div style={{ width: "1px", height: "100vh", backgroundColor: "lightgrey" }} />

      <div style={{ flex: "3" }}>
        <div style={{ display: "flex", flexDirection: "column", height: "100%", flexGrow: "0", overflowY: "auto" }}>
          <div style={{ height: "8vh" }}>
            <PredictionDisplay />
          </div>
          <div style={{ height: "92vh" }}>
            {chatInterface ? <ChatComponent
              apiKey={key}
              setExplanation={setExplanation}
              messageInputEnabled={messageInputEnabled}
              setMessageInputEnabled={setMessageInputEnabled}
              setKeyColor={setKeyColor}
              setTestKeyFunc={setTestKeyFunc}
            /> : <NoChatComponent setExplanation={setExplanation} />}
          </div>
        </div>
      </div>

      <div style={{ width: "1px", height: "100vh", backgroundColor: "lightgrey" }} />

      <div style={{ flex: "1 0", height: "100vh", overflowY: "auto" }}>
        <QuizComponent />
      </div>
    </div>
  );
}

export default App