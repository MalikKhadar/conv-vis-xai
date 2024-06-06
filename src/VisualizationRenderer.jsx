import { useState, useEffect } from 'react';
import simData from "./assets/datapoint/income_sim.json";
import cfData from "./assets/datapoint/income_cf.json";
import ComparisonTable from './ComparisonTable';

const VisualizationRenderer = ({ parentState, defaultMessage }) => {
  const [visState, setVisState] = useState(0);

  useEffect(() => {
    setVisState(parentState);
  }, [parentState]);

  const renderSwitch = (index) => {
    switch (index) {
      case 0:
        return <div style={{display: "flex", flexFlow: "column", alignItems: "center"}}><img src="https://raw.githubusercontent.com/MalikKhadar/conv-vis-xai/main/src/assets/datapoint/income_waterfall.png" style={{ maxHeight: "55vh" }} /><p>In this plot, negative f(x) values indicate "<b>less</b> than $50k" classifications, whereas positive f(x) values indicate the opposite</p></div>
      case 1:
        return <div style={{ width: "100%", maxHeight: "60vh" }}><ComparisonTable tableData={simData} />(The model made <b>the same prediction</b> on each of these data points. The first row is the main data point. Cells are gold when they share the same value as the main data point)</div>
      case 2:
        return <div style={{ width: "100%", maxHeight: "60vh" }}><ComparisonTable tableData={cfData} />(The model made <b>the opposite prediction</b> for each of these data points when compared to the main data point in the first row. Cells are gold when they share the same value as the main data point)</div>;
      default:
        return <p>{defaultMessage}</p>;
    }
  }

  return (
    <div style={{ margin: "auto", textAlign: "center" }}>
      {renderSwitch(visState)}
    </div>
  );
};

export default VisualizationRenderer;
