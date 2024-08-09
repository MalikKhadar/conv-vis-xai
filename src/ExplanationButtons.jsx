import { useState, useEffect } from 'react';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { Button } from '@chatscope/chat-ui-kit-react';
import SplitButton from './SplitButton';
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

  const handleSubVisualizationChange = (visualizationObject, newSubVisualization) => {
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

  const RowOfButtons = ({ visualizations }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', height: "50%", alignItems: "start" }}>
      {visualizations.map((visualizationObject) => (
        <div key={visualizationObject.name} style={{ display: "flex", height: "100%", flex: "1", alignItems: "center" }}>
          {visualizationObject.subVisualizations ?
            <SplitButton
              disabled={writingIntro}
              hidden={guided && !introducedVisualizations.includes(visualizationObject.name)}
              style={{
                flex: "1",
                display: guided && !introducedVisualizations.includes(visualizationObject.name) ? "none" : "block",
                height: "100%",
                backgroundColor: visualizationObject.name === visualizationObjects.activeVisualization ? '#c6e3fa' : "white"
              }}
              visualizationObject={visualizationObject}
              visualizationObjects={visualizationObjects}
              handleSubVisualizationChange={handleSubVisualizationChange}
            />
            :
            <Button
              border
              disabled={writingIntro}
              onClick={() => {
                setVisualizationObjects(prevState => ({
                  ...prevState,
                  activeVisualization: visualizationObject.name
                }));
                addLog('Viewing visualization ' + visualizationObject.name);
              }}
              style={{
                flex: "1",
                display: guided && !introducedVisualizations.includes(visualizationObject.name) ? "none" : "block",
                height: "100%",
                backgroundColor: visualizationObject.name === visualizationObjects.activeVisualization ? '#c6e3fa' : "white"
              }}
            >
              {visualizationObject.name + (visualizationObject.global ? "" : " (data point " + datapointNum.toString() + ")")}
            </Button>
          }
        </div>
      ))}
    </div>
  );

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '5px', width: '100%' }}>
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%' }}>
          <div style={{ flex: "1", display: "flex", flexDirection: "row" }}>
            <FormControl variant="outlined">
              <Select
                style={{ pointerEvents: "none" }}
                labelId="datapoint-select-label"
                sx={{ boxShadow: 'none', '.MuiOutlinedInput-notchedOutline': { border: 0 } }}
                value="Global"
                IconComponent={() => null}
              >
                <MenuItem value="Global">
                  Global
                </MenuItem>
              </Select>
            </FormControl>
          </div>
          <div style={{ flex: "1", display: "flex", flexDirection: "row" }}>
            <FormControl variant="outlined"
              style={{
                visibility: Object.keys(visualizationObjects).includes("visualizations") && guided && introducedVisualizations.every(
                  visName => visualizationObjects.visualizations[visName]?.global
                ) ? "hidden" : "visible"
              }}
            >
              <Select
                labelId="datapoint-select-label"
                sx={{ boxShadow: 'none', '.MuiOutlinedInput-notchedOutline': { border: 0 } }}
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