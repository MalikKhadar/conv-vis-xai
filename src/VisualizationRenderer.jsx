import { useState, useEffect } from 'react';
import simData from "./assets/datapoint/income_sim.json";
import cfData from "./assets/datapoint/income_cf.json";
import ComparisonTable from './ComparisonTable';
import modelInfo from "./assets/modelInfo.json";

const VisualizationRenderer = ({ parentState, defaultMessage }) => {
  const [visState, setVisState] = useState(0);

  useEffect(() => {
    setVisState(parentState);
  }, [parentState]);

  const renderSwitch = (index) => {
    switch (index) {
      case 0:
        return <img src={modelInfo.explanations[0].visualization} style={{ maxHeight: "60vh" }} />
      case 1:
        return <div style={{ width: "100%", maxHeight: "60vh" }}><ComparisonTable tableData={simData} />(The model made <b>the same prediction</b> on each of these data points. The first row is the main data point)</div>
      case 2:
        return <div style={{ width: "100%", maxHeight: "60vh" }}><ComparisonTable tableData={cfData} />(The model made <b>the opposite prediction</b> for each of these data points when compared to the main data point in the first row)</div>;
      default:
        return <p>{defaultMessage}</p>;
    }
  }

  return (
    <div style={{ margin: "auto", overflowX: "auto", overflowY: "hidden" }}>
      {renderSwitch(visState)}
    </div>
  );
};

export default VisualizationRenderer;
