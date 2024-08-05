import { useState, useEffect } from 'react';

const VisualizationRenderer = ({ activeVisualizationObject }) => {
  const [activeVisualizationImage, setActiveVisualizationImage] = useState("");

  useEffect(() => {
    if (activeVisualizationObject) {
      if ('subVisualizations' in activeVisualizationObject) {
        setActiveVisualizationImage(activeVisualizationObject.subVisualizations[activeVisualizationObject.activeSubVisualization]);
      } else {
        setActiveVisualizationImage(activeVisualizationObject.module);
      }
    }
  }, [activeVisualizationObject]);

  return (
    <img src={activeVisualizationImage} style={{ maxHeight: "100%", maxWidth: "100%", alignSelf: "center", display: "flex" }} />
  );
};

export default VisualizationRenderer;