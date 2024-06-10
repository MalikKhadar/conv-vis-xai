import React, { useState, useEffect } from 'react';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { Button } from '@chatscope/chat-ui-kit-react';
import VisualizationRenderer from './VisualizationRenderer';

const notes = import.meta.glob('/src/assets/datapoints/**/visualizations/notes.json');

const ExplanationButtons = ({ buttonsEnabled, showExplanation, datapointPath }) => {
  const [noteMap, setNoteMap] = useState({});

  useEffect(() => {
    const loadNotes = async () => {
      const notesPath = Object.keys(notes).find(path => path.includes(datapointPath));
      if (notesPath) {
        const notesModule = await notes[notesPath]();
        setNoteMap(notesModule.default || notesModule);
      } else {
        console.log('No notes found for path:', datapointPath);
      }
    };
    loadNotes();
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", maxHeight: "100%" }}>
      <h2 style={{ textAlign: "center" }}>Click to view explanations</h2>
      {Object.keys(noteMap).map((key, index) => (
        <Button
          key={index}
          disabled={!buttonsEnabled}
          border
          onClick={() => showExplanation(index)}
          style={{ flex: "1", overflow: "hidden" }}
        >
          {noteMap[key].name}
          <div style={{ flex: "1", display: "flex", justifyContent: "center", alignItems: "center", width: "100%", height: "100%" }}>
            <VisualizationRenderer parentState={index} defaultMessage={""} datapointPath={datapointPath} />
          </div>
        </Button>
      ))}
    </div>
  );
};

export default ExplanationButtons;