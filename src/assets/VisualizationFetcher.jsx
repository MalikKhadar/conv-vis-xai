import { useState, useEffect } from 'react';

const VisualizationFetcher = ({ activeVisualization, datapointNum, setVisualizationPath }) => {
  // Import all JSON and PNG files from the base directory
  const allVisualizations = import.meta.glob('/src/assets/nonTutorial/**/*.png');
  const [visualizations, setVisualizations] = useState([]);
  const [graphData, setGraphData] = useState(null);

  useEffect(() => {
    const loadGraphData = async () => {
      const graph = await import('/src/assets/nonTutorial/graph.json');
      setGraphData(graph.default || graph);
    };

    loadGraphData();
  }, []);

  useEffect(() => {
    const loadVisualizations = async () => {
      // Only keep the files that match our visualization path
      const loadedVisualizations = [];
      const globalPath = '/src/assets/nonTutorial/global/';
      const datapointPath = '/src/assets/nonTutorial/datapoints/${datapointNum}/';

      for (const path in allVisualizations) {
        // filter out irrelevant assets
        if (path.includes(globalPath) || path.includes(datapointPath)) {
          const module = await allVisualizations[path]();
          const visualizationName = path.substring(path.lastIndexOf('/') + 1);
          const connections = graphData[visualizationName];
          loadedVisualizations[visualizationName] = { path, connections, module: module.default || module };
        }
      }

      setVisualizations(loadedVisualizations);
    };
    loadVisualizations();
  }, [datapointNum]);

  useEffect(() => {
    setVisualizationPath(visualizations[activeVisualization]);
  }, [activeVisualization]);

  return null;
};

export default VisualizationFetcher;