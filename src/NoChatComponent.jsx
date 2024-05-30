import { useState, useEffect } from 'react';
import modelInfo from './modelInfo.json';

const NoChatComponent = ({ setExplanation }) => {
  const [imageSrc, setImageSrc] = useState(modelInfo.explanations[0].visualization);

  useEffect(() => {
    setExplanation(() => showVisualization);
  }, [setExplanation]);

  const showVisualization = (index) => {
    setImageSrc(modelInfo.explanations[index].visualization);
  };

  return (
    <div style={{ width: "100%", height: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
      <img src={imageSrc} style={{ maxWidth: "100%" }} />
    </div>
  );
};

export default NoChatComponent;
