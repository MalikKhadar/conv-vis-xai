import { useState, useEffect, useRef } from 'react'
import './App.css'
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import QuizComponent from './QuizComponent';
import ExplanationButtons from './ExplanationButtons';
import ChatComponent from './ChatComponent';
import PredictionDisplay from './PredictionDisplay';
import TutorialPage from './TutorialPage';
import VisualizationRenderer from './VisualizationRenderer';
import VisualizationFetcher from './VisualizationFetcher';
import OpenTutorialButton from './OpenTutorialButton';
import TestKey from './TestKey'
import { useAddCustomData, useAddLog, useUploadLogs } from './Logger';

function App() {
  const [finishedTutorial, setFinishedTutorial] = useState(false);
  const [activeVisualizationName, setActiveVisualizationName] = useState("Global Bar Plot");
  const [activeVisualizationObject, setActiveVisualizationObject] = useState(null);
  const [visualizationObjects, setVisualizationObjects] = useState({});
  const [datapointNum, setDatapointNum] = useState(0);
  const addLog = useAddLog();
  const addCustomData = useAddCustomData();
  const uploadLogs = useUploadLogs();
  const hasLoggedRef = useRef(false); // Create a ref to track if logging has been done
  const [apiKey, setApiKey] = useState('');
  const [chatActive, setChatActive] = useState(false);
  const [tutorialOnly, setTutorialOnly] = useState(false);
  const [isChatting, setIsChatting] = useState(false);
  const [guided, setGuided] = useState(true);
  const [questions, setQuestions] = useState([])
  const [visitedAllVisualizations, setVisitedAllVisualizations] = useState(false);
  const [done, setDone] = useState(false);
  const [graphData, setGraphData] = useState(null);

  useEffect(() => {
    const loadGraphData = async () => {
      const graph = await import('/src/assets/nonTutorial/graph.json');
      setGraphData(graph.default || graph);
    };

    loadGraphData();
  }, []);

  useEffect(() => {
    if (!hasLoggedRef.current) {
      firstLoad();
      hasLoggedRef.current = true;
    }
  }, []);

  useEffect(() => {
    if (visitedAllVisualizations) {
      setGuided(false);
    }
  }, [visitedAllVisualizations]);

  useEffect(() => {
    if (done) {
      uploadLogs();
    }
  }, [done]);

  const firstLoad = () => {
    addLog('Loaded page');
    // extract url params
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    if (urlParams.has('chat')) {
      setIsChatting(true);
    }
    addCustomData('chat', urlParams.has('chat'));
    addCustomData('participantId', urlParams.get("id"));
    setTutorialOnly(urlParams.has('tutorialOnly'));
  };

  const handleFinishTutorial = () => {
    setFinishedTutorial(true);
    addLog('Finished tutorial');
  };

  if (done) {
    return (
      <p style={{ textAlign: "center" }}>
        Please return to the Qualtrics and enter the following code: {isChatting ? "gopher" : "continue"}
        <br />(You may exit out of this tab)
      </p>
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
    <div className="App" style={{ display: 'flex', gap: '5px', height: "100vh", margin: "auto", boxSizing: "border-box", padding: "10px" }}>
      <VisualizationFetcher
        activeVisualizationName={activeVisualizationName}
        setActiveVisualizationObject={setActiveVisualizationObject}
        visualizationObjects={visualizationObjects}
        setVisualizationObjects={setVisualizationObjects}
        datapointNum={datapointNum}
        graphData={graphData}
        setVisitedAllVisualizations={setVisitedAllVisualizations}
      />
      {isChatting ? <TestKey apiKey={apiKey} setApiKey={setApiKey} setChatActive={setChatActive} /> : null}

      <div style={{ display: 'flex', flexDirection: 'column', flex: "1", height: "100%", minWidth: "15vw", overflowY: "hidden" }}>
        <div style={{ flex: "1" }}>
          <PredictionDisplay datapointNum={datapointNum} />
        </div>
        <div style={{ flex: "2" }}>
          {visitedAllVisualizations ?
            <QuizComponent setDone={setDone} setQuestions={setQuestions} />
            :
            <p>Visit all 6 types of visualizations before accessing the quiz</p>
          }
        </div>
        <div style={{ flex: "1", alignContent: "end" }}>
          <OpenTutorialButton isChatting={isChatting} />
        </div>
      </div>

      <div style={{ width: "1px", height: "100%", backgroundColor: "lightgrey" }} />
      <div style={{ flex: "3", display: "flex", flexDirection: "column", height: "100%", justifyContent: "space-between" }}>
        {isChatting ?
          <div style={{ flex: "3", height: "50%" }}>
            <ChatComponent
              apiKey={apiKey}
              setActiveVisualizationName={setActiveVisualizationName}
              activeVisualizationObject={activeVisualizationObject}
              activeVisualizationName={activeVisualizationName}
              datapointNum={datapointNum}
              chatActive={chatActive}
              questions={questions}
              guided={guided}
            />
          </div>
          :
          <div style={{ flex: "1 1 auto", overflowY: "auto", alignContent: "center" }}>
            <VisualizationRenderer
              activeVisualizationObject={activeVisualizationObject}
              activeVisualizationName={activeVisualizationName}
            />
          </div>}

        <ExplanationButtons
          activeVisualizationObject={activeVisualizationObject}
          setActiveVisualizationName={setActiveVisualizationName}
          visualizationObjects={visualizationObjects}
          guided={guided}
        />
        <label htmlFor="numberSelect">Choose a data point:</label>
        <select
          id="numberSelect"
          value={datapointNum}
          onChange={(event) => setDatapointNum(parseInt(event.target.value, 10))}
        >
          <option value="0">0</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
        </select>
      </div>
    </div>
  );
}

export default App