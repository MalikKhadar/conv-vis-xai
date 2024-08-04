import { useState, useEffect } from 'react';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { Button } from '@chatscope/chat-ui-kit-react';
import { useAddLog } from './Logger';

const ExplanationButtons = ({ activeVisualizationObject, setActiveVisualizationName, visualizationObjects, datapointNum, numberOfDatapoints, setDatapointNum, guided }) => {
  const [globalVisualizationObjects, setGlobalVisualizationObjects] = useState([]);
  const [localVisualizationObjects, setLocalVisualizationObjects] = useState([]);
  const [selectedSubVisualizations, setSelectedSubvisualizations] = useState({});
  const [datapointLabels, setDatapointLabels] = useState([]);
  const addLog = useAddLog();

  useEffect(() => {
    if (visualizationObjects) {
      // set the default selected subvisualizations
      let loadedSelectedSubVisualizations = selectedSubVisualizations;

      for (const visualizationObject in visualizationObjects) {
        const loadedVisualizationObject = visualizationObjects[visualizationObject];
        if ("subVisualizations" in loadedVisualizationObject) {
          loadedSelectedSubVisualizations[loadedVisualizationObject.name] = Object.keys(loadedVisualizationObject.subVisualizations)[0];
        }
      }

      // populate lists of global and local visualizations
      setGlobalVisualizationObjects(Object.values(visualizationObjects)
        .filter(visualization => visualization.global)
        .sort((a, b) => a.order - b.order));

      setLocalVisualizationObjects(Object.values(visualizationObjects)
        .filter(visualization => !visualization.global)
        .sort((a, b) => a.order - b.order));
    }
  }, [visualizationObjects]);

  useEffect(() => {
    const newDatapointLabels = Array.from({ length: numberOfDatapoints }, (v, i) => ({
      value: i,
      label: `Local (data point ${i})`
    }));

    setDatapointLabels(newDatapointLabels);
  }, [numberOfDatapoints]);

  const handleSubVisualizationChange = (name, e) => {
    setActiveVisualizationName(name + "/" + e.target.value);
    let loadedSelectedSubVisualizations = selectedSubVisualizations;
    loadedSelectedSubVisualizations[name] = e.target.value;
    setSelectedSubvisualizations(loadedSelectedSubVisualizations);

    addLog('Viewing subvisualization ' + name + "/" + e.target.value)
  }

  const subVisualizationDropdown = (options, name) => (
    <FormControl style={{ flex: "1" }}>
      <InputLabel id="select-label">Sub-Visualizataion</InputLabel>
      <Select
        labelId="select-label"
        value={selectedSubVisualizations[name]}
        onChange={(e) => handleSubVisualizationChange(name, e)}
        label="Sub-Visualization"
      >
        {Object.keys(options).map((key) => (
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
            onClick={() => { setActiveVisualizationName(visualizationObject.name); addLog('Viewing visualization ' + visualizationObject.name) }}
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
            subVisualizationDropdown(visualizationObject["subVisualizations"], visualizationObject.name)}
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
                value={datapointNum}
                onChange={(event) => {
                  setDatapointNum(parseInt(event.target.value, 10));
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