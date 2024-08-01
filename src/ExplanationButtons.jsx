import { useState, useEffect } from 'react';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { Button } from '@chatscope/chat-ui-kit-react';
import { useAddLog } from './Logger';

const ExplanationButtons = ({ activeVisualizationObject, setActiveVisualizationName, graphData }) => {
  const [visualizationNames, setVisualizationNames] = useState([]);
  const addLog = useAddLog();

  useEffect(() => {
    if (graphData && graphData.Visualizations) {
      console.log(Object.keys(graphData.Visualizations));
      setVisualizationNames(Object.keys(graphData.Visualizations));
    }
  }, [graphData]);

  return (
    <>
      {visualizationNames.map((name) => (
        <Button
          key={name}
          border
          onClick={() => { setActiveVisualizationName(name); addLog('Viewing visualization ' + name)}}
          style={{ flex: "1", backgroundColor: activeVisualizationObject && name == activeVisualizationObject.name ? '#c6e3fa' : "white" }}
        >
          {name}
        </Button>
      ))}
    </>
  );
};

export default ExplanationButtons;