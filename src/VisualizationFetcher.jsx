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
        activeSubVisualization: "age",
        module: scatterPlots.age
      };

      setActiveVisualizationObject(loadedVisualizations[activeVisualizationName]);
      setVisualizationObjects(loadedVisualizations);
    };
    loadVisualizations();
  }, [datapointNum]);

  useEffect(() => {
    if (visualizationObjects) {
      if (activeVisualizationName.includes("/")) {
        const nameParts = activeVisualizationName.split("/");
        let updatedVisualizationObject = visualizationObjects[nameParts[0]];
        updatedVisualizationObject.activeSubVisualization = nameParts[1];
        updatedVisualizationObject.module = visualizationObjects[nameParts[0]].subVisualizations[nameParts[1]];
        setActiveVisualizationObject(updatedVisualizationObject);

        let newVisualizationObjects = visualizationObjects;
        newVisualizationObjects[nameParts[0]] = updatedVisualizationObject;

        setVisualizationObjects(newVisualizationObjects);
      } else {
        setActiveVisualizationObject(visualizationObjects[activeVisualizationName]);
      }
    }
  }, [activeVisualizationName]);

  return null;
};

export default VisualizationFetcher;