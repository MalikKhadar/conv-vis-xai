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
import NextDatapointMessage from './NextDatapointMessage';
import { useAddCustomData, useAddLog, useUploadLogs } from './Logger';

function App() {
  const [finishedTutorial, setFinishedTutorial] = useState(false);
  const [visualizationState, setVisualizationState] = useState(0);
  const addLog = useAddLog();
  const addCustomData = useAddCustomData();
  const uploadLogs = useUploadLogs();
  const hasLoggedRef = useRef(false); // Create a ref to track if logging has been done
  const [apiKey, setApiKey] = useState('');
  const [chatActive, setChatActive] = useState(false);
  const [datapointPath, setDatapointPath] = useState('');
  const [tutorialOnly, setTutorialOnly] = useState(false);
  const [isChatting, setIsChatting] = useState(false);
  const [questions, setQuestions] = useState([])
  const [datapointIndex, setDatapointIndex] = useState(0);
  const [datapointOrder, setDatapointOrder] = useState(["0", "1"]);
  const [openNextDatapointMessage, setOpenNextDatapointMessage] = useState(false);
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

    const datapointAllocation = urlParams.get("d");
    // load datapoint paths
    let correctDatapoint = '/src/assets/datapoints/correct/' + datapointAllocation.charAt(0);
    let incorrectDatapoint = '/src/assets/datapoints/incorrect/' + datapointAllocation.charAt(1);

    let newDatapointOrder = [correctDatapoint, incorrectDatapoint];

    if (Math.random() > 0.5) {
      newDatapointOrder = [incorrectDatapoint, correctDatapoint];
    }

    if (urlParams.has('chat')) {
      setIsChatting(true);
    }
    addCustomData('chat', urlParams.has('chat'));

    const newDatapointPath = newDatapointOrder[datapointIndex];

    setDatapointOrder(newDatapointOrder);
    setDatapointPath(newDatapointPath);
    addCustomData('participantId', urlParams.get("id"));
    addCustomData('datapoint', newDatapointPath);
    setTutorialOnly(urlParams.has('tutorialOnly'));
    setLoaded(true);
  };

  useEffect(() => {
    if (loaded) {
      uploadLogs();

      if (datapointIndex >= 2) {
        setDone(true);
        return;
      }

      if (datapointIndex > 0) {
        setOpenNextDatapointMessage(true);
      }
      setVisualizationState(0);

      addCustomData('datapoint', datapointOrder[datapointIndex]);
      setDatapointPath(datapointOrder[datapointIndex]);
    }
  }, [datapointIndex]);

  const handleFinishTutorial = () => {
    setFinishedTutorial(true);
    addLog('Finished tutorial');
  };

  if (done) {
    return (
      <p style={{ textAlign: "center" }}>Please return to the Qualtrics and enter the following code: {isChatting ? "gopher" : "continue"}<br />(You may exit out of this tab)</p>
    )
  }

  // render tutorial
  if (!finishedTutorial) {
    return (
      <div>
        <TutorialPage />
        {!tutorialOnly ?
          <div style={{ display: "flex", flexFlow: "column", justifyContent: "center", alignItems: "center" }}>
            <div><b>If you need help:</b> This tutorial will be available by clicking a "Reopen Tutorial" button.</div>
            <b>Click the "Begin" button below to load the interface</b>
            <br />
            <button onClick={handleFinishTutorial} style={{ marginBottom: "10px" }}>Begin</button>
          </div>
          : null}
      </div >
    )
  }

  // main attraction
  return (
    <div className="App" style={{ display: 'flex', gap: '5px', height: "100vh", margin: "auto" }}>
      <NextDatapointMessage openNextDatapointMessage={openNextDatapointMessage} setOpenNextDatapointMessage={setOpenNextDatapointMessage} />
      {isChatting ? <TestKey apiKey={apiKey} setApiKey={setApiKey} setChatActive={setChatActive} /> : null}

      <div style={{ display: 'flex', flexDirection: 'column', flex: "1", height: "100vh", minWidth: "15vw", overflowY: "hidden" }}>
        <div style={{ flex: "0" }}>
          <PredictionDisplay datapointPath={datapointPath} />
        </div>
        <ExplanationButtons visualizationState={visualizationState} setVisualizationState={setVisualizationState} style={{ flex: "1" }} datapointPath={datapointPath} />
        <div style={{ height: "5vh" }} />
        <OpenTutorialButton isChatting={isChatting} />
      </div>

      <div style={{ width: "1px", height: "100vh", backgroundColor: "lightgrey" }} />

      <div style={{ flex: "3", display: "flex", flexDirection: "column", height: "100vh", justifyContent: "space-between" }}>
        <div style={{ flex: "1 1 auto", overflowY: "auto", alignContent: "center" }}>
          <VisualizationRenderer
            parentState={visualizationState}
            datapointPath={datapointPath}
            defaultMessage={"Click on the explanations to the left to help understand the model's prediction"}
          />
        </div>

        <div style={{ flex: "1" }}>
          <QuizComponent
            datapointPath={datapointPath}
            datapointIndex={datapointIndex}
            setDatapointIndex={setDatapointIndex}
            setQuestions={setQuestions}
          />
        </div>
      </div>

      {isChatting ?
        <ChatComponent
          apiKey={apiKey}
          visualizationState={visualizationState}
          datapointPath={datapointPath}
          chatActive={chatActive}
          questions={questions}
        />
        : <div />}
    </div>
  );
}

export default App