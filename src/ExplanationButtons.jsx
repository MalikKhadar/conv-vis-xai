import React from 'react';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { Button } from '@chatscope/chat-ui-kit-react';
import VisualizationRenderer from './VisualizationRenderer';

const ExplanationButtons = ({ buttonsEnabled, showExplanation }) => {
  return (
    <div style={{ display: "flex", flexDirection: "column", maxHeight: "100%" }}>
      <h2 style={{ textAlign: "center" }}>Click to view explanations</h2>
      <Button disabled={!buttonsEnabled} border onClick={() => showExplanation(0)} style={{ flex: "1", overflow: "hidden" }}>
        Waterfall Plot
        <div style={{ flex: "1", display: "flex", justifyContent: "center", alignItems: "center", width: "100%", height: "100%" }}>
          <VisualizationRenderer parentState={0} />
        </div>
      </Button>
      <Button disabled={!buttonsEnabled} border onClick={() => showExplanation(1)} style={{ flex: "1", overflow: "hidden" }}>
        Similar Data Points
        <div style={{ flex: "1", display: "flex", justifyContent: "center", alignItems: "center", width: "100%", height: "100%" }}>
          <VisualizationRenderer parentState={1} />
        </div>
      </Button>
      <Button disabled={!buttonsEnabled} border onClick={() => showExplanation(2)} style={{ flex: "1", overflow: "hidden" }}>
        Counterfactual Data Points
        <div style={{ flex: "1", display: "flex", justifyContent: "center", alignItems: "center", width: "100%", height: "100%" }}>
          <VisualizationRenderer parentState={2} />
        </div>
      </Button>
    </div>
  )
}

export default ExplanationButtons;