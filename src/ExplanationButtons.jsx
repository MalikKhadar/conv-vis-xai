import { useState, useEffect } from 'react';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { Button } from '@chatscope/chat-ui-kit-react';
import { useAddLog } from './Logger';

const ExplanationButtons = ({ visualizationObjects, setVisualizationObjects, datapointNum, setDatapointNum, numberOfDatapoints, guided, writingIntro, introducedVisualizations }) => {
  const [datapointLabels, setDatapointLabels] = useState([]);
  const addLog = useAddLog();

  useEffect(() => {
    const newDatapointLabels = Array.from({ length: numberOfDatapoints }, (v, i) => ({
      value: i,
      label: `Local (data point ${i})`
    }));

    setDatapointLabels(newDatapointLabels);
  }, [numberOfDatapoints]);

  const handleSubVisualizationChange = (visualizationObject, e) => {
    const newSubVisualization = e.target.value;
    const updatedVisualizationObject = {
      ...visualizationObjects.visualizations[visualizationObject.name],
      activeSubVisualization: newSubVisualization
    };

    setVisualizationObjects(prevState => ({
      ...prevState,
      visualizations: {
        ...prevState.visualizations,
        [visualizationObject.name]: updatedVisualizationObject
      },
      activeVisualization: visualizationObject.name
    }));

    addLog('Viewing subvisualization ' + visualizationObject.name + "/" + newSubVisualization);
  };

  const subVisualizationDropdown = (visualizationObject) => (
    <FormControl style={{ flex: "1" }}>
      <InputLabel id="select-label">Sub-Visualization</InputLabel>
      <Select
        labelId="select-label"
        value={visualizationObject.activeSubVisualization || ''}
        onChange={(e) => handleSubVisualizationChange(visualizationObject, e)}
        label="Sub-Visualization"
      >
        {Object.keys(visualizationObject.subVisualizations || {}).map((key) => (
          <MenuItem key={key} value={key}>
            {key}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );

  const RowOfButtons = ({ visualizations }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', height: "50%", alignItems: "start" }}>
      {visualizations.map((visualizationObject) => (
        <div key={visualizationObject.name} style={{ display: "flex", height: "100%", flex: "1", alignItems: "center" }}>
          <Button
            // border
            border = {!(guided && !introducedVisualizations.includes(visualizationObject.name))}
            // style={{display: "none"}}
            disabled={writingIntro || (guided && !introducedVisualizations.includes(visualizationObject.name))}
            onClick={() => {
              setVisualizationObjects(prevState => ({
                ...prevState,
                activeVisualization: visualizationObject.name
              }));
              addLog('Viewing visualization ' + visualizationObject.name);
            }}
            style={{
              flex: "1",
              // display: "none",
              height: "100%",
              backgroundColor: visualizationObject.name === visualizationObjects.activeVisualization ? '#c6e3fa' : "white"
            }}
          >
            {guided && !introducedVisualizations.includes(visualizationObject.name) ? "" : visualizationObject.name}
          </Button>
          {visualizationObject.subVisualizations && subVisualizationDropdown(visualizationObject)}
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
                // using visualizationObjects.visualizations just to see if stuff is loaded
                value={visualizationObjects.visualizations ? datapointNum : ""}
                onChange={(event) => {
                  const newDatapointNum = parseInt(event.target.value, 10);
                  setDatapointNum(newDatapointNum);
                  addLog('Set datapoint to ' + newDatapointNum.toString());
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
      {visualizationObjects.visualizations ? (
        <div>
          <RowOfButtons
            visualizations={visualizationObjects.globalOrder.map(name => visualizationObjects.visualizations[name])}
          />
          <RowOfButtons
            visualizations={visualizationObjects.localOrder.map(name => visualizationObjects.visualizations[name])}
          />
        </div>
      ) : null}
    </div>
  );
};

export default ExplanationButtons;