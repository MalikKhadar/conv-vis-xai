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
    <div style={{ width: "100%" }}>
      <img src={imageSrc} style={{ display: "block", height: "100vh", marginLeft: "auto", marginRight: "auto" }} />
    </div>
  );
};

export default NoChatComponent;
