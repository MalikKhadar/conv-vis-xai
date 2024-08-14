import { useEffect } from 'react';

const VisualizationFetcher = ({ visualizationObjects, setVisualizationObjects, setUnvisitedVisualizationsNum, datapointNum, graphData }) => {
  const allVisualizations = import.meta.glob('/src/assets/nonTutorial/**/*.png');

  useEffect(() => {
    const loadVisualizations = async () => {
      const visualizations = {};
      const globalOrder = [];
      const localOrder = [];
      const globalPath = '/src/assets/nonTutorial/global/';
      const datapointPath = `/src/assets/nonTutorial/datapoints/${datapointNum}/`;
      const scatterPath = '/src/assets/nonTutorial/global/Scatter Plots/';
      const scatterPlots = {};

      for (const path in allVisualizations) {
        if (path.includes(globalPath) || path.includes(datapointPath)) {
          const module = await allVisualizations[path]();
          const visualizationName = path.substring(path.lastIndexOf('/') + 1).split(".")[0];

          if (path.includes(scatterPath)) {
            scatterPlots[visualizationName] = module.default || module;
          } else {
            let visualizationObject = graphData[visualizationName];
            let loadedVisited = visualizationObjects.visualizations ?
              visualizationObjects.visualizations[visualizationName].visited : false;

            visualizations[visualizationName] = {
              path,
              name: visualizationName,
              connections: visualizationObject.Connections,
              global: visualizationObject.Global,
              module: module.default || module,
              order: visualizationObject.Order,
              visited: loadedVisited
            };

            if (visualizationObject.Global) {
              globalOrder.push(visualizationName);
            } else {
              localOrder.push(visualizationName);
            }
          }
        }
      }

      let loadedSubVisualization = "";
      let loadedVisited = false;
      if (visualizationObjects.visualizations) {
        loadedSubVisualization = visualizationObjects.visualizations["Scatter Plots"].activeSubVisualization;
        loadedVisited = visualizationObjects.visualizations["Scatter Plots"].visited;
      }

      visualizations["Scatter Plots"] = {
        path: "none",
        name: "Scatter Plots",
        connections: graphData["Scatter Plots"].Connections,
        global: graphData["Scatter Plots"].Global,
        subVisualizations: scatterPlots,
        activeSubVisualization: loadedSubVisualization,
        order: graphData["Scatter Plots"].Order,
        visited: loadedVisited
      };
      globalOrder.push("Scatter Plots");

      // Sort the global and local orders based on the 'order' property
      const sortedGlobalOrder = globalOrder.sort((a, b) => visualizations[a].order - visualizations[b].order);
      const sortedLocalOrder = localOrder.sort((a, b) => visualizations[a].order - visualizations[b].order);

      setUnvisitedVisualizationsNum(Object.keys(visualizations).length);
      setVisualizationObjects({
        visualizations,
        globalOrder: sortedGlobalOrder,
        localOrder: sortedLocalOrder,
        activeVisualization: visualizationObjects?.activeVisualization || sortedGlobalOrder[0]
      });
    };
    loadVisualizations();
  }, [datapointNum]);

  return null;
};

export default VisualizationFetcher;