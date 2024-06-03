import React from 'react';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import metadata from "./assets/datapoint/metadata.json"

function PredictionDisplay() {
  return (
    <h2 style={{ textAlign: "center" }} >
      Model predicts that this person made {metadata["prediction"] ? "more" : "less"} than 50k in 1995
    </h2>
  );
}

export default PredictionDisplay;