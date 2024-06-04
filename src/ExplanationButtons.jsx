import React from 'react';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { Button } from '@chatscope/chat-ui-kit-react';
import VisualizationRenderer from './VisualizationRenderer';

const ExplanationButtons = ({ buttonsEnabled, showExplanation }) => {
  return (
    <div style={{ display: "flex", flexDirection: "column", maxHeight: "100%" }}>
      <h2 style={{ textAlign: "center" }}>Click to view explanations</h2>
      <Button disabled={!buttonsEnabled} border onClick={() => showExplanation(0)} style={{ flex: "1" }}>
        Waterfall Plot
        <img src="https://raw.githubusercontent.com/MalikKhadar/conv-vis-xai/main/src/assets/datapoint/income_waterfall.png" style={{ width: "100%" }} />
      </Button>
      <Button disabled={!buttonsEnabled} border onClick={() => showExplanation(1)} style={{ flex: "1", overflow: "hidden" }}>
        Similar Data Points
        <VisualizationRenderer parentState={1} />
      </Button>
      <Button disabled={!buttonsEnabled} border onClick={() => showExplanation(2)} style={{ flex: "1", overflow: "hidden" }}>
        Counterfactual Data Points
        <VisualizationRenderer parentState={2} />
      </Button>
    </div>
  )
}

export default ExplanationButtons;