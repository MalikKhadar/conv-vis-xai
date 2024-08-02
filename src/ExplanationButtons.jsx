import { useState, useEffect } from 'react';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { Button } from '@chatscope/chat-ui-kit-react';
import { useAddLog } from './Logger';

const ExplanationButtons = ({ activeVisualizationObject, setActiveVisualizationName, visualizationObjects }) => {
  const [visualizationNames, setVisualizationNames] = useState([]);
  const addLog = useAddLog();

  useEffect(() => {
    if (visualizationObjects) {
      console.log(Object.keys(visualizationObjects));
      setVisualizationNames(Object.keys(visualizationObjects));
    }
  }, [visualizationObjects]);

  const renderDropdown = (options, name) => (
    <select onChange={(e) => setActiveVisualizationName(name + "/" + e.target.value)}>
      {Object.keys(options).map((key) => (
        <option key={key} value={key}>
          {key}
        </option>
      ))}
    </select>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", maxHeight: "100%" }}>
      {visualizationNames.map((name) => (
        <div key={name} style={{ display: "flex", alignItems: "center", marginBottom: '10px' }}>
          {activeVisualizationObject && "subVisualizations" in visualizationObjects[name] &&
            renderDropdown(visualizationObjects[name]["subVisualizations"], name)}
          <Button
            key={name}
            border
            onClick={() => { setActiveVisualizationName(name); addLog('Viewing visualization ' + name) }}
            style={{ flex: "1", backgroundColor: activeVisualizationObject && name == activeVisualizationObject.name ? '#c6e3fa' : "white" }}
          >
            {name}
          </Button>
        </div>
      ))}
    </div>
  );
};

export default ExplanationButtons;