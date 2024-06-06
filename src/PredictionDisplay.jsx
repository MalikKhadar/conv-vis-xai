import React from 'react';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import metadata from "./assets/datapoint/metadata.json"

function PredictionDisplay() {
  return (
    <h2 style={{ textAlign: "center", fontWeight: "normal" }} >
      Model prediction: <b>{metadata["prediction"] ? "more" : "less"}</b> than $50k
    </h2>
  );
}

export default PredictionDisplay;