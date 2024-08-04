import React, { useState, useEffect } from 'react';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';

function PredictionDisplay({ datapointNum, setNumberOfDatapoints }) {
  const [predictions, setPredictions] = useState([]);

  useEffect(() => {
    const loadPredictions = async () => {
      // Import all JSON files
      const metadataFiles = import.meta.glob('/src/assets/nonTutorial/datapoints/**/metadata.json');

      // Create an array of promises to load the files
      const loadFilePromises = Object.entries(metadataFiles).map(async ([path, loadFile]) => {
        const module = await loadFile();
        return { path, prediction: module.default.prediction };
      });

      // Resolve all promises and sort the results by path
      const results = await Promise.all(loadFilePromises);
      results.sort((a, b) => {
        const aIndex = parseInt(a.path.match(/\/(\d+)\//)[1], 10);
        const bIndex = parseInt(b.path.match(/\/(\d+)\//)[1], 10);
        return aIndex - bIndex;
      });

      // Extract predictions in order
      const orderedPredictions = results.map(result => result.prediction);
      setPredictions(orderedPredictions);
      
      setNumberOfDatapoints(orderedPredictions.length);
    };

    loadPredictions();
  }, []);


  return (
    <h3 style={{ textAlign: "center", fontWeight: "normal" }}>
      Model prediction: <b>{predictions[datapointNum] ? "more" : "less"} than $50k</b>
    </h3>
  );
}

export default PredictionDisplay;
