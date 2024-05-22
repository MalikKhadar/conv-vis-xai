import React from 'react';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { Button } from '@chatscope/chat-ui-kit-react';

const KeyComponent = ({ apiKey, keyColor, testKeyFunc, changeKey, messageInputEnabled }) => {
  return (
    <div style={{ display: 'flex' }}>
      <input
        placeholder="Paste GPT Key Here"
        style={{ color: "#213547", backgroundColor: keyColor, flex: 1, WebkitTextSecurity: "disc" }}
        onChange={changeKey}
      />
      <Button
        disabled={messageInputEnabled}
        border
        onClick={() => testKeyFunc(apiKey)}
      >
        Submit Key
      </Button>
    </div>
  );
}

export default KeyComponent;