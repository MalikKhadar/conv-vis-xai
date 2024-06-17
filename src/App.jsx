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
import { useAddLog } from './Logger';

function App() {
  const [finishedTutorial, setFinishedTutorial] = useState(false);
  const [visualizationState, setVisualizationState] = useState(0);
  const addLog = useAddLog();
  const hasLoggedRef = useRef(false); // Create a ref to track if logging has been done

  // Testing new workflow for github

  useEffect(() => {
    if (!hasLoggedRef.current) {
      addLog('Loaded page');
      hasLoggedRef.current = true; // Set the ref to true after logging
    }
  }, [addLog]);

  const handleFinishTutorial = () => {
    setFinishedTutorial(true);
    addLog('Finished tutorial');
  };

  // extract url params
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  let isChatting = false;
  if (urlParams.has('chat')) {
    isChatting = true;
  }
  let datapoint = urlParams.get("datapoint");
  const datapointPath = "src/assets/datapoints/" + datapoint;
  let id = urlParams.get("id");
  let tutorialOnly = urlParams.has('tutorialOnly');

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
          <div style={{ height: "70%" }}>
            <VisualizationRenderer
              parentState={visualizationState}
              datapointPath={datapointPath}
              defaultMessage={"Click on the explanations to the left to help understand the model's prediction"}
            />
          </div>

          <div style={{ height: "1px", width: "100%", marginTop: "5px", marginBottom: "5px", backgroundColor: "lightgrey" }} />

          <div style={{ flex: "1" }}>
            <QuizComponent
              datapointPath={datapointPath}
              id={id}
              isChatting={isChatting}
            />
          </div>
        </div>
      </div>

      {isChatting ?
        <ChatComponent
          apiKey={import.meta.env.VITE_API_KEY}
          visualizationState={visualizationState}
          datapointPath={datapointPath}
        />
        : <div />}
    </div>
  );
}

export default App