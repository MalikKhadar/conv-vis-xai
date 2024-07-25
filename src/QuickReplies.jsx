import React, { useState, useEffect } from 'react';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { Button } from '@chatscope/chat-ui-kit-react';
import { useAddLog } from './Logger';

const notes = import.meta.glob('/src/assets/datapoints/**/visualizations/notes.json');

const QuickReplies = ({ datapointPath, setVisualizationState, visualizationState }) => {
  const [noteMap, setNoteMap] = useState({});
  const addLog = useAddLog();

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
  }, [datapointPath]);

  return (
    <div style={{ display: "flex", flexDirection: "column", maxWidth: "40%" }}>
      {Object.keys(noteMap).map((key, index) => (
        <Button
          key={index}
          border
          onClick={() => {setVisualizationState(index); addLog('Viewing visualization ' + index.toString())}}
          style={{ flex: "1", fontSize: "20px", backgroundColor: index == visualizationState ? '#c6e3fa' : "white" }}
        >
          {noteMap[key].name}
        </Button>
      ))}
    </div>
  );
};

export default QuickReplies;