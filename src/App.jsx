import { useState, useEffect, useRef } from 'react'
import './App.css'
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import QuizComponent from './QuizComponent';
import ExplanationButtons from './ExplanationButtons';
import ChatComponent from './ChatComponent';
import PredictionDisplay from './PredictionDisplay';
import InterpretationTutorial from './InterpretationTutorial';
import VisualizationRenderer from './VisualizationRenderer';
import VisualizationFetcher from './VisualizationFetcher';
import OpenTutorialButton from './OpenTutorialButton';
import TestKey from './TestKey'
import { useAddCustomData, useAddLog, useUploadLogs } from './Logger';

function App() {
  const [finishedTutorial, setFinishedTutorial] = useState(false);
  const [graphData, setGraphData] = useState(null);
  const [visualizationObjects, setVisualizationObjects] = useState({});
  const [datapointNum, setDatapointNum] = useState(0);
  const [numberOfDatapoints, setNumberOfDatapoints] = useState(0);

  const addLog = useAddLog();
  const addCustomData = useAddCustomData();
  const uploadLogs = useUploadLogs();
  const hasLoggedRef = useRef(false); // Create a ref to track if logging has been done

  const [apiKey, setApiKey] = useState('');
  const [chatActive, setChatActive] = useState(false);
  const [interpretationTutorial, setInterpretationTutorial] = useState(false);
  const [isChatting, setIsChatting] = useState(false);

  const [guided, setGuided] = useState(false);
  const [writingIntro, setWritingIntro] = useState(false);
  const [introducedVisualizations, setIntroducedVisualizations] = useState(["Global Bar Plot"]);
  const [questions, setQuestions] = useState([])
  const [unvisitedVisualizationsNum, setUnvisitedVisualizationsNum] = useState(1);
  const [visitedAllVisualizations, setVisitedAllVisualizations] = useState(false);
  const [done, setDone] = useState(false);

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
    const activeName = visualizationObjects.activeVisualization;

    if (!activeName) {
      return;
    }

    const currentVisualization = visualizationObjects.visualizations[activeName];

    if (currentVisualization && !currentVisualization.visited) {
      const updatedUnvisitedVisualizationsNum = unvisitedVisualizationsNum - 1;

      if (updatedUnvisitedVisualizationsNum <= 0) {
        setVisitedAllVisualizations(true);
      }
      setUnvisitedVisualizationsNum(updatedUnvisitedVisualizationsNum);

      const updatedVisualization = {
        ...currentVisualization,
        visited: true
      };

      setVisualizationObjects((prevState) => {
        const updatedVisualizations = {
          ...prevState.visualizations,
          [activeName]: updatedVisualization
        };

        return {
          ...prevState,
          visualizations: updatedVisualizations
        };
      });
    }
  }, [visualizationObjects]);

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
      addCustomData('condition', 'chat');
    }
    else if (urlParams.has('guide')) {
      setGuided(true);
      setIsChatting(true);
      addCustomData('condition', 'guided');
    } else {
      addCustomData('condition', 'no chat');
    }
    addCustomData('participantId', urlParams.get("id"));
    setInterpretationTutorial(urlParams.has('interpretationTutorial'));
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
        <InterpretationTutorial />
        {!interpretationTutorial ?
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
        visualizationObjects={visualizationObjects}
        setVisualizationObjects={setVisualizationObjects}
        setUnvisitedVisualizationsNum={setUnvisitedVisualizationsNum}
        datapointNum={datapointNum}
        graphData={graphData}
      />
      {isChatting ? <TestKey apiKey={apiKey} setApiKey={setApiKey} setChatActive={setChatActive} /> : null}

      <div style={{ display: 'flex', flexDirection: 'column', flex: "1", height: "100%", minWidth: "15vw", overflowY: "hidden" }}>
        <PredictionDisplay datapointNum={datapointNum} setNumberOfDatapoints={setNumberOfDatapoints} />
        <div style={{ flex: "1" }}>
          {visitedAllVisualizations ?
            <QuizComponent setDone={setDone} setQuestions={setQuestions} />
            :
            <p style={{ textAlign: "center", marginTop: "50%" }}>The questions will appear once you've explored the data and visuals presented to the right</p>
          }
        </div>
        <div style={{ flex: "0", alignContent: "end" }}>
          <OpenTutorialButton isChatting={isChatting} />
        </div>
      </div>

      <div style={{ width: "1px", height: "100%", backgroundColor: "lightgrey" }} />
      <div style={{ flex: "3", display: "flex", gap: '7px', flexDirection: "column", height: "100%", justifyContent: "space-between" }}>
        {isChatting ?
          <div style={{ flex: "3", height: "50%" }}>
            {visualizationObjects.visualizations ?
              <ChatComponent
                apiKey={apiKey}
                visualizationObjects={visualizationObjects}
                datapointNum={datapointNum}
                chatActive={chatActive}
                questions={questions}
                guided={guided}
                setWritingIntro={setWritingIntro}
                introducedVisualizations={introducedVisualizations}
                setIntroducedVisualizations={setIntroducedVisualizations}
              />
              : null}
          </div>
          :
          <div style={{ display: "flex", flex: "3", overflowY: "auto", justifyContent: "center" }}>
            <VisualizationRenderer
              visualizationObjects={visualizationObjects}
              datapointNum={datapointNum}
            />
          </div>}

        <ExplanationButtons
          visualizationObjects={visualizationObjects}
          setVisualizationObjects={setVisualizationObjects}
          datapointNum={datapointNum}
          setDatapointNum={setDatapointNum}
          numberOfDatapoints={numberOfDatapoints}
          guided={guided}
          writingIntro={writingIntro}
          introducedVisualizations={introducedVisualizations}
        />
      </div>
    </div>
  );
}

export default App