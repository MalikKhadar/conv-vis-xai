import { useEffect } from 'react';

const VisualizationFetcher = ({ visualizationObjects, setVisualizationObjects, setUnvisitedVisualizationsNum, datapointNum, graphData }) => {
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
              connectionText: visualizationObject["Connection Text"],
              global: visualizationObject.Global,
              module: module.default || module,
              order: visualizationObject.Order,
              visited: false
            };
          }
        }
      }
      
      let loadedActiveSubVisualization = Object.keys(scatterPlots)[0];
      if (visualizationObjects && "Scatter Plots" in visualizationObjects) {
        console.log("scatter plots already has an active subvisualization");
        loadedActiveSubVisualization = visualizationObjects["Scatter Plots"].activeSubVisualization;
        console.log(loadedActiveSubVisualization);
      }

      loadedVisualizations["Scatter Plots"] = {
        path: "none",
        name: "Scatter Plots",
        connections: graphData["Scatter Plots"].Connections,
        connectionText: graphData["Scatter Plots"]["Connection Text"],
        global: graphData["Scatter Plots"].Global,
        subVisualizations: scatterPlots,
        activeSubVisualization: loadedActiveSubVisualization,
        order: graphData["Scatter Plots"].Order,
        visited: false
      };

      setUnvisitedVisualizationsNum(Object.keys(loadedVisualizations).length);
      setVisualizationObjects(loadedVisualizations);
    };
    loadVisualizations();
  }, [datapointNum]);

  return null;
};

export default VisualizationFetcher;