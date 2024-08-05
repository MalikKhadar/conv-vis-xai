import { useState, useEffect } from 'react';

const VisualizationRenderer = ({ visualizationObjects }) => {
  const [activeVisualizationImage, setActiveVisualizationImage] = useState("");

  useEffect(() => {
    const activeName = visualizationObjects.activeVisualization;
    
    if (!activeName) {
      return;
    }

    const currentVisualization = visualizationObjects.visualizations[activeName];

    if (currentVisualization) {
      if ('subVisualizations' in currentVisualization) {
        setActiveVisualizationImage(currentVisualization.subVisualizations[currentVisualization.activeSubVisualization]);
      } else {
        setActiveVisualizationImage(currentVisualization.module);
      }
    }
  }, [visualizationObjects]);

  return (
    <img src={activeVisualizationImage} style={{ maxHeight: "100%", maxWidth: "100%", alignSelf: "center", display: "flex" }} />
  );
};

export default VisualizationRenderer;