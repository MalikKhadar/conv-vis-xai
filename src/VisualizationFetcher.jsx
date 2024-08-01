import { useState, useEffect } from 'react';

const VisualizationFetcher = ({ activeVisualizationName, setActiveVisualizationObject, datapointNum, scatter, graphData }) => {
  // Import all JSON and PNG files from the base directory
  const allVisualizations = import.meta.glob('/src/assets/nonTutorial/**/*.png');
  const [visualizations, setVisualizations] = useState();

  useEffect(() => {
    const loadVisualizations = async () => {
      // Only keep the files that match our visualization path
      const loadedVisualizations = { "Scatter Plots": {} };
      const globalPath = '/src/assets/nonTutorial/global/';
      const datapointPath = '/src/assets/nonTutorial/datapoints/${datapointNum}/';
      const scatterPath = '/src/assets/nonTutorial/global/Scatter Plots/';

      for (const path in allVisualizations) {
        // filter out irrelevant assets
        if (path.includes(globalPath) || path.includes(datapointPath)) {
          const module = await allVisualizations[path]();
          const visualizationName = path.substring(path.lastIndexOf('/') + 1).split(".")[0];
          console.log(visualizationName);

          if (path.includes(scatterPath)) {
            loadedVisualizations["Scatter Plots"][visualizationName] = {
              path,
              name: visualizationName,
              module: module.default || module
            }
          } else {
            const visualizationObject = graphData.Visualizations[visualizationName];
            loadedVisualizations[visualizationName] = {
              path,
              name: visualizationName,
              connections: visualizationObject.Connections,
              global: visualizationObject.Global,
              module: module.default || module
            };
          }
        }
      }
      console.log(loadedVisualizations);

      setVisualizations(loadedVisualizations);
    };
    loadVisualizations();
  }, [datapointNum]);

  useEffect(() => {
    if (visualizations && activeVisualizationName in visualizations) {
      setActiveVisualizationObject(visualizations[activeVisualizationName]);
    }
  }, [activeVisualizationName]);

  return null;
};

export default VisualizationFetcher;