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

  if (activeVisualizationImage) {
    return (
      <img src={activeVisualizationImage} style={{ maxHeight: "100%", maxWidth: "100%", alignSelf: "center", display: "flex" }} />
    )
  } else {
    return (
      <p style={{ maxHeight: "100%", maxWidth: "100%", alignSelf: "center", display: "flex" }}>Use the buttons below to begin your exploration</p>
    )
  }
};

export default VisualizationRenderer;