import React from 'react';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { Button } from '@chatscope/chat-ui-kit-react';

const ExplanationButtons = ({ buttonsEnabled, showExplanation }) => {
  return (
    <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
      <h3 style={{ textAlign: "center" }}>Click to view explanations</h3>
      <Button disabled={!buttonsEnabled} border onClick={() => showExplanation(0)}> Explanation 1 </Button>
      <Button disabled={!buttonsEnabled} border onClick={() => showExplanation(1)}> Explanation 2 </Button>
      <Button disabled={!buttonsEnabled} border onClick={() => showExplanation(2)}> Explanation 3 </Button>
    </div>
  )
}

export default ExplanationButtons;