import { useState, useEffect } from 'react';

const VisualizationFetcher = ({ activeVisualizationName, setActiveVisualizationObject, visualizationObjects, setVisualizationObjects, datapointNum, graphData }) => {
  // Import all JSON and PNG files from the base directory
  const allVisualizations = import.meta.glob('/src/assets/nonTutorial/**/*.png');

  useEffect(() => {
    const loadVisualizations = async () => {
      // Only keep the files that match our visualization path
      const loadedVisualizations = {
        "Scatter Plots": {
          name: "Scatter Plots",
          connections: graphData["Scatter Plots"].Connections,
          global: graphData["Scatter Plots"].Global,
          subVisualizations: []
        }
      };
      const globalPath = '/src/assets/nonTutorial/global/';
      const datapointPath = '/src/assets/nonTutorial/datapoints/' + datapointNum.toString() + "/";
      const scatterPath = '/src/assets/nonTutorial/global/Scatter Plots/';
      let scatterPlots = {};

      for (const path in allVisualizations) {
        // filter out irrelevant assets
        if (path.includes(globalPath) || path.includes(datapointPath)) {
          const module = await allVisualizations[path]();
          const visualizationName = path.substring(path.lastIndexOf('/') + 1).split(".")[0];
          console.log(visualizationName);

          if (path.includes(scatterPath)) {
            scatterPlots[visualizationName] = module.default || module;
          } else {
            let visualizationObject = graphData[visualizationName];

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
      loadedVisualizations["Scatter Plots"] = {
        path: "none",
        name: "Scatter Plots",
        connections: graphData["Scatter Plots"].Connections,
        global: graphData["Scatter Plots"].Global,
        subVisualizations: scatterPlots,
        activeSubVisualization: "age"
      };

      console.log(loadedVisualizations);
      setActiveVisualizationObject(loadedVisualizations[activeVisualizationName]);
      setVisualizationObjects(loadedVisualizations);
    };
    loadVisualizations();
  }, [datapointNum]);

  useEffect(() => {
    console.log("naem chagen");
    if (visualizationObjects) {
      if (activeVisualizationName.includes("/")) {
        const nameParts = activeVisualizationName.split("/");
        visualizationObjects[nameParts[0]].activeSubVisualization = nameParts[1];
        setActiveVisualizationObject(visualizationObjects[nameParts[0]]);
      } else {
        setActiveVisualizationObject(visualizationObjects[activeVisualizationName]);
      }
    }
  }, [activeVisualizationName]);

  return null;
};

export default VisualizationFetcher;