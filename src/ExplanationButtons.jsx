import React from 'react';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { Button } from '@chatscope/chat-ui-kit-react';

const ExplanationButtons = ({ buttonsEnabled, showExplanation }) => {
  return (
    <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
      <h3 style={{ textAlign: "center" }}>Click to view explanations</h3>
      <Button disabled={!buttonsEnabled} border onClick={() => showExplanation(0)}>
        Waterfall Plot
        <img src="src\assets\income_waterfall.png" style={{ width: "100%" }} />
      </Button>
      <Button disabled={!buttonsEnabled} border onClick={() => showExplanation(1)}> 
        Similar Data Points
        <img src="src\assets\income_sim.png" style={{ width: "100%" }} />
      </Button>
      <Button disabled={!buttonsEnabled} border onClick={() => showExplanation(2)}> 
        Counterfactual Data Points
        <img src="src\assets\income_cf.png" style={{ width: "100%" }} />
      </Button>
    </div>
  )
}

export default ExplanationButtons;