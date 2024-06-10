import { useState, useEffect } from 'react';
import VisualizationRenderer from './VisualizationRenderer';

const NoChatComponent = ({ setExplanation, datapointPath }) => {
  const [myState, setMyState] = useState(-1);

  useEffect(() => {
    setExplanation(() => showVisualization);
  }, [setExplanation]);

  const showVisualization = (index) => {
    setMyState(index);
  };

  return (
    <div style={{ display: "flex", width: "100%", alignContent: "center" }}>
      <VisualizationRenderer parentState={myState} datapointPath={datapointPath} defaultMessage={"Click on the explanations to the left to help understand the model's prediction"}/>
    </div>
  );
};

export default NoChatComponent;
