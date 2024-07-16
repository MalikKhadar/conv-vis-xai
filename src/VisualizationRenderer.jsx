import { useState, useEffect } from 'react';
import ComparisonTable from './ComparisonTable';

const VisualizationRenderer = ({ parentState, defaultMessage, datapointPath }) => {
  const [visState, setVisState] = useState(0);
  const [visualizations, setVisualizations] = useState([]);

  // Import all JSON and PNG files from the base directory
  const allVisualizations = import.meta.glob('/src/assets/datapoints/**/visualizations/*.{json,png}');

  useEffect(() => {
    const loadVisualizations = async () => {
      // Only keep the files that match our visualization path
      const loadedVisualizations = [];

      for (const path in allVisualizations) {
        // filter out irrelevant assets and the notes
        if (path.includes(datapointPath) && !path.includes("notes")) {
          const module = await allVisualizations[path]();
          const index = path.match(/\/(\d+)\.[json|png]+$/)[1];
          loadedVisualizations[index] = { path, module: module.default || module };
        }
      }

      setVisualizations(loadedVisualizations);
    };
    loadVisualizations();
  }, [datapointPath]);

  useEffect(() => {
    setVisState(parentState);
  }, [parentState]);

  const renderVisualization = (visualization, index) => {
    if (visualization.path.endsWith('.json')) {
      return (
        <div key={index} style={{ display: "flex", width: "100%", maxHeight: "50vh", alignItems: "center", height: "100%" }}>
          <ComparisonTable tableData={visualization.module} />
        </div>
      );
    } else if (visualization.path.endsWith('.png')) {
      return (
        <div key={index} style={{ display: "flex", flexFlow: "column", justifyContent: "center", width: "100%", height: "100%" }}>
          <img src={visualization.module} style={{ maxHeight: "65vh", minHeight: "80%", maxWidth: "100%", alignSelf: "center" }} />
        </div>
      );
    } else {
      return <p key={index}>{defaultMessage}</p>;
    }
  };

  return (
    <div style={{ display: "block", margin: "auto", height: "100%" }}>
      {visualizations[visState] ? (
        renderVisualization(visualizations[visState], visState)
      ) : (
        <p>{defaultMessage}</p>
      )}
    </div>
  );
};

export default VisualizationRenderer;