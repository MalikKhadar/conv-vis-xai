import { useState, useEffect, useRef } from 'react'
import './App.css'
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import QuizComponent from './QuizComponent';
import ExplanationButtons from './ExplanationButtons';
import ChatComponent from './ChatComponent';
import PredictionDisplay from './PredictionDisplay';
import TutorialPage from './TutorialPage';
import VisualizationRenderer from './VisualizationRenderer';
import OpenTutorialButton from './OpenTutorialButton';
import TestKey from './TestKey'
import { useAddLog } from './Logger';

function App() {
  const [finishedTutorial, setFinishedTutorial] = useState(false);
  const [visualizationState, setVisualizationState] = useState(0);
  const addLog = useAddLog();
  const hasLoggedRef = useRef(false); // Create a ref to track if logging has been done
  const [apiKey, setApiKey] = useState('');
  const [chatActive, setChatActive] = useState(false);
  const [datapointPath, setDatapointPath] = useState('');
  const [id, setId] = useState('');
  const [tutorialOnly, setTutorialOnly] = useState(false);
  const [isChatting, setIsChatting] = useState(false);
  const [datapointIndex, setDatapointIndex] = useState(0);
  const [datapointOrder, setDatapointOrder] = useState(["0", "1"]);
  const [loaded, setLoaded] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!hasLoggedRef.current) {
      firstLoad();
      hasLoggedRef.current = true;
    }
  }, []);

  const firstLoad = () => {
    addLog('Loaded page');
    // extract url params
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    // load datapoint paths
    let newPath = '/src/assets/datapoints/noChat/';
    let newDatapointOrder = ["0", "1"];

    if (urlParams.has('chat')) {
      setIsChatting(true);
      newPath = '/src/assets/datapoints/chat/';
    }

    if (Math.random() > 0.5) {
      newDatapointOrder = ["1", "0"];
    }

    const updatedPath = newPath + (newDatapointOrder[datapointIndex] || '');

    setDatapointOrder(newDatapointOrder);
    console.log(updatedPath);
    setDatapointPath(updatedPath);
    setId(urlParams.get("id"));
    setTutorialOnly(urlParams.has('tutorialOnly'));
    setLoaded(true);
  };

  useEffect(() => {
    // console.log("the datapointIndex effect has run");
    if (loaded) {
      if (datapointIndex >= 2) {
        setDone(true);
        return;
      }

      const queryString = window.location.search;
      const urlParams = new URLSearchParams(queryString);

      let newPath = '/src/assets/datapoints/noChat/';

      if (urlParams.has('chat')) {
        setIsChatting(true);
        newPath = '/src/assets/datapoints/chat/';
      }

      const updatedPath = newPath + (datapointOrder[datapointIndex] || '');
      setDatapointPath(updatedPath);
    }
  }, [datapointIndex]);

  const handleFinishTutorial = () => {
    setFinishedTutorial(true);
    addLog('Finished tutorial');
  };

  if (done) {
    return (
      <p style={{ textAlign: "center" }}>This segment of the study is complete. Please return to Qualtrics to finish this study (you may exit out of this page)</p>
    )
  }

  // render tutorial
  if (!finishedTutorial) {
    return (
      <div>
        <TutorialPage />
        {!tutorialOnly ?
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
            <button onClick={handleFinishTutorial} style={{ marginBottom: "10px" }}>Begin</button>
          </div>
          : null}
      </div >
    )
  }

  // main attraction
  return (
    <div className="App" style={{ display: 'flex', gap: '5px', height: "100vh", margin: "auto" }}>
      {isChatting ? <TestKey apiKey={apiKey} setApiKey={setApiKey} setChatActive={setChatActive} /> : null}

      <div style={{ display: 'flex', flexDirection: 'column', flex: "1", height: "100vh", minWidth: "15vw", overflowY: "hidden" }}>
        <OpenTutorialButton />
        <div style={{ height: "3vh" }} />
        <ExplanationButtons visualizationState={visualizationState} setVisualizationState={setVisualizationState} style={{ flex: "1" }} datapointPath={datapointPath} />
      </div>

      <div style={{ width: "1px", height: "100vh", backgroundColor: "lightgrey" }} />

      <div style={{ flex: "3", display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden" }}>
        <div style={{ flex: "0 0 auto" }}>
          <PredictionDisplay datapointPath={datapointPath} />
        </div>
        <div style={{ flex: "1 1 auto", display: 'flex', flexDirection: 'column', overflowY: "auto" }}>
          <VisualizationRenderer
            parentState={visualizationState}
            datapointPath={datapointPath}
            defaultMessage={"Click on the explanations to the left to help understand the model's prediction"}
          />

          <div style={{ height: "1px", width: "100%", marginTop: "5px", marginBottom: "5px", backgroundColor: "lightgrey" }} />

          <div style={{ flex: "1" }}>
            <QuizComponent
              datapointPath={datapointPath}
              id={id}
              datapointIndex={datapointIndex}
              setDatapointIndex={setDatapointIndex}
              isChatting={isChatting}
            />
          </div>
        </div>
      </div>

      {isChatting ?
        <ChatComponent
          apiKey={apiKey}
          visualizationState={visualizationState}
          datapointPath={datapointPath}
          chatActive={chatActive}
        />
        : <div />}
    </div>
  );
}

export default App