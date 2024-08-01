import { useState, useEffect } from 'react';

const VisualizationRenderer = ({ activeVisualizationObject }) => {
  const [activeVisualizationImage, setActiveVisualizationImage] = useState("");

  useEffect(() => {
    if (activeVisualizationObject) {
      setActiveVisualizationImage(activeVisualizationObject.module);
    }
  }, [activeVisualizationObject]);

  return (
    // <div style={{ display: "block", margin: "auto", height: "100%" }}>
    // <div key={index} style={{ display: "flex", flexFlow: "column", justifyContent: "center", width: "100%", height: "100%" }}>
    <img src={activeVisualizationImage} style={{ maxHeight: "100%", minWidth: "90%", maxWidth: "100%", alignSelf: "center" }} />
    // </div>
    // </div>
  );
};

export default VisualizationRenderer;