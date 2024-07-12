import React, { useState, useEffect } from 'react';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';

function PredictionDisplay({ datapointPath }) {
  const [prediction, setPrediction] = useState(null);

  useEffect(() => {
    const fetchMetadata = async () => {
      const metadataFiles = import.meta.glob(`/src/assets/datapoints/**/metadata.json`);
      const metadataPath = Object.keys(metadataFiles).find(path => path.includes(datapointPath));

      if (metadataPath) {
        try {
          const module = await metadataFiles[metadataPath]();
          setPrediction(module.prediction);
        } catch (error) {
          console.error('Error fetching metadata:', error);
        }
      } else {
        console.error(`Metadata file not found for path: ${datapointPath}`);
      }
    };

    fetchMetadata();
  }, [datapointPath]);

  return (
    <h3 style={{ textAlign: "center", fontWeight: "normal" }}>
      Model prediction: <b>{prediction ? "more" : "less"} than $50k</b>
    </h3>
  );
}

export default PredictionDisplay;
