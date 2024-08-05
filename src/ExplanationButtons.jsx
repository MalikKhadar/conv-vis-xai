import { useState, useEffect } from 'react';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { Button } from '@chatscope/chat-ui-kit-react';
import { useAddLog } from './Logger';

const ExplanationButtons = ({ activeVisualizationObject, setActiveVisualizationObject, visualizationObjects, datapointNum, setDatapointNum, numberOfDatapoints, guided }) => {
  const [globalVisualizationObjects, setGlobalVisualizationObjects] = useState([]);
  const [localVisualizationObjects, setLocalVisualizationObjects] = useState([]);
  const [datapointLabels, setDatapointLabels] = useState([]);
  const [hasSetDefaultVisualization, setHasSetDefaultVisualization] = useState(false);
  const addLog = useAddLog();

  useEffect(() => {
    if (visualizationObjects) {
      const loadedGlobalVisualizationObjects = Object.values(visualizationObjects)
        .filter(visualization => visualization.global)
        .sort((a, b) => a.order - b.order);

      // populate lists of global and local visualizations
      setGlobalVisualizationObjects(loadedGlobalVisualizationObjects);

      setLocalVisualizationObjects(Object.values(visualizationObjects)
        .filter(visualization => !visualization.global)
        .sort((a, b) => a.order - b.order));

      if (!hasSetDefaultVisualization && loadedGlobalVisualizationObjects.length > 0) {
        setActiveVisualizationObject(loadedGlobalVisualizationObjects[0]);
        setHasSetDefaultVisualization(true);
      }

      if (activeVisualizationObject) {
        setActiveVisualizationObject(visualizationObjects[activeVisualizationObject.name]);
      }
    }
  }, [visualizationObjects]);

  useEffect(() => {
    const newDatapointLabels = Array.from({ length: numberOfDatapoints }, (v, i) => ({
      value: i,
      label: `Local (data point ${i})`
    }));

    setDatapointLabels(newDatapointLabels);
  }, [numberOfDatapoints]);

  const handleSubVisualizationChange = (visualizationObject, e) => {
    const newSubVisualization = e.target.value;
    let updatedVisualizationObject = null;
  
    const updateVisualizationObjects = (prevState) => {
      return prevState.map(obj => {
        if (obj.name === visualizationObject.name) {
          const updatedObj = { ...obj, activeSubVisualization: newSubVisualization };
          updatedVisualizationObject = updatedObj;
          return updatedObj;
        }
        return obj;
      });
    };
  
    if (visualizationObject.global) {
      setGlobalVisualizationObjects(prevState => updateVisualizationObjects(prevState));
    } else {
      setLocalVisualizationObjects(prevState => updateVisualizationObjects(prevState));
    }
  
    // Ensure updatedVisualizationObject is set before calling setActiveVisualizationObject
    if (updatedVisualizationObject) {
      setActiveVisualizationObject(updatedVisualizationObject);
      addLog('Viewing subvisualization ' + updatedVisualizationObject.name + "/" + newSubVisualization);
    } else {
      console.error('Updated Visualization Object is null');
    }
  };

  const subVisualizationDropdown = (visualizationObject) => (
    <FormControl style={{ flex: "1" }}>
      <InputLabel id="select-label">Sub-Visualization</InputLabel>
      <Select
        labelId="select-label"
        value={visualizationObject.activeSubVisualization}
        onChange={(e) => handleSubVisualizationChange(visualizationObject, e)}
        label="Sub-Visualization"
      >
        {Object.keys(visualizationObject.subVisualizations).map((key) => (
          <MenuItem key={key} value={key}>
            {key}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );

  const RowOfButtons = ({ visualizationObjects }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', height: "50%", alignItems: "start", gap: "2px" }}>
      {visualizationObjects.map((visualizationObject) => (
        <div key={visualizationObject.name} style={{ display: "flex", height: "100%", flex: "1", alignItems: "center", marginBottom: '10px' }}>
          <Button
            border
            onClick={() => { setActiveVisualizationObject(visualizationObject); addLog('Viewing visualization ' + visualizationObject.name) }}
            style={{
              flex: "1",
              height: "100%",
              backgroundColor: activeVisualizationObject && visualizationObject.name == activeVisualizationObject.name ? '#c6e3fa' :
                guided && activeVisualizationObject.connections.includes(visualizationObject.name) ? "#FAF7C6" : "white"
            }}
          >
            {visualizationObject.name}
          </Button>
          {activeVisualizationObject && "subVisualizations" in visualizationObject &&
            subVisualizationDropdown(visualizationObject)}
        </div>
      ))}
    </div>
  );

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '5px', width: '100%' }}>
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%' }}>
          <p style={{ flex: "1" }}>Global</p>
          <div style={{ flex: "1", display: "flex", flexDirection: "row" }}>
            <FormControl variant="outlined">
              <Select
                labelId="datapoint-select-label"
                value={activeVisualizationObject ? datapointNum : ''}
                onChange={(event) => {
                  setDatapointNum(parseInt(event.target.value, 10));
                  setActiveVisualizationObject(activeVisualizationObject);
                  addLog('Set datapoint to ' + (event.target.value).toString())
                }}
              >
                {datapointLabels.map((datapoint) => (
                  <MenuItem key={datapoint.value} value={datapoint.value}>
                    {datapoint.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
        </div>
      </div>
      <div>
        <RowOfButtons visualizationObjects={globalVisualizationObjects} />
        <RowOfButtons visualizationObjects={localVisualizationObjects} />
      </div>
    </div>
  );
};

export default ExplanationButtons;