import { useState, useEffect } from 'react';
import ComparisonTable from './ComparisonTable';

const VisualizationRenderer = ({ parentState, defaultMessage, datapointPath, setCurrentVisualizationPath }) => {
  const [visState, setVisState] = useState(0);
  const [visualizations, setVisualizations] = useState([]);
  const [noteMap, setNoteMap] = useState({});

  // Import all JSON and PNG files from the base directory, in addition to associated notes
  const allVisualizations = import.meta.glob('/src/assets/datapoints/**/visualizations/*.{json,png}');
  const notes = import.meta.glob('/src/assets/datapoints/**/visualizations/notes.json');

  useEffect(() => {
    const loadVisualizations = async () => {
      // Only keep the files that match our visualization path
      const loadedVisualizations = [];

      for (const path in allVisualizations) {
        // filter out irrelevant assets and the notes
        if (path.includes(datapointPath) && !path.includes("notes")) {
          const module = await allVisualizations[path]();
          const index = path.match(/\/(\d+)\.[json|png]+$/)[1];
          loadedVisualizations[index] = { path, module: module.default || module };
        }
      }

      setVisualizations(loadedVisualizations);
    };

    const loadNotes = async () => {
      const notesPath = Object.keys(notes).find(path => path.includes(datapointPath));
      if (notesPath) {
        const notesModule = await notes[notesPath]();
        setNoteMap(notesModule.default || notesModule);
      }
    };

    loadVisualizations();
    loadNotes();
  }, [datapointPath]);

  useEffect(() => {
    setVisState(parentState);
  }, [parentState]);

  useEffect(() => {
    if (setCurrentVisualizationPath && visualizations[visState]) {
      setCurrentVisualizationPath(visualizations[visState].path);
    }
  }, [visState, visualizations, setCurrentVisualizationPath]);

  const renderVisualization = (visualization, index) => {
    const note = noteMap[index] || { name: "", explanation: defaultMessage };

    if (visualization.path.endsWith('.json')) {
      return (
        <div key={index} style={{ width: "100%", maxHeight: "60vh" }}>
          <ComparisonTable tableData={visualization.module} />
          <p dangerouslySetInnerHTML={{ __html: note.explanation }}></p>
        </div>
      );
    } else if (visualization.path.endsWith('.png')) {
      return (
        <div key={index} style={{ display: "flex", flexFlow: "column", alignItems: "center" }}>
          <img src={visualization.module} style={{ maxHeight: "55vh" }} />
          <p dangerouslySetInnerHTML={{ __html: note.explanation }}></p>
        </div>
      );
    } else {
      return <p key={index}>{defaultMessage}</p>;
    }
  };

  return (
    <div style={{ margin: "auto", textAlign: "center" }}>
      {visualizations[visState] ? (
        renderVisualization(visualizations[visState], visState)
      ) : (
        <p>{defaultMessage}</p>
      )}
    </div>
  );
};

export default VisualizationRenderer;