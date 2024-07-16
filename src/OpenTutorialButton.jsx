import React from 'react';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { Button } from '@chatscope/chat-ui-kit-react';
import { useAddLog } from './Logger';

const OpenTutorialButton = () => {
  const addLog = useAddLog();

  const openTutorial = () => {
    addLog('Reopened tutorial');

    // Get the current URL without the query string
    const baseUrl = window.location.origin + window.location.pathname;

    // Define the new query string
    const newQueryString = "?tutorialOnly";

    // Open a new tab with the new URL
    window.open(baseUrl + newQueryString, '_blank');
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", maxHeight: "100%" }}>
      <Button
        border
        onClick={openTutorial}
      >
        Reopen Tutorial
      </Button>
    </div>
  );
};

export default OpenTutorialButton;