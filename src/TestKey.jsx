import { useState } from 'react';
import Modal from '@mui/joy/Modal';
import Typography from '@mui/joy/Typography';
import Sheet from '@mui/joy/Sheet';
import { TextField, Button } from '@mui/material';
import OpenAI from 'openai';

function TestKey({ apiKey, setApiKey, setChatActive }) {
  const [keyOpen, setKeyOpen] = useState(true);
  const [isValid, setIsValid] = useState(true);

  const handleApiKeyChange = (e) => {
    setApiKey(e.target.value);
  };

  const handleSubmit = async () => {
    const gptModel = 'gpt-4';
    const systemMessage = 'You are a helpful assistant.'; // GPT came up with this, I would never...
    const messages = [
      { role: 'user', content: 'Hello, world' }
    ];

    const apiRequestBody = {
      model: gptModel,
      messages: [
        { role: 'system', content: systemMessage },
        ...messages
      ],
      stream: false
    };

    try {
      const openai = new OpenAI({
        apiKey: apiKey,
        dangerouslyAllowBrowser: true
      });
      let response = await openai.chat.completions.create(apiRequestBody);

      // Assuming a successful response means the key is valid
      if (response) {
        setIsValid(true);
        setChatActive(true);
        setKeyOpen(false); // Close modal on valid key
      }
    } catch (error) {
      setIsValid(false); // Mark as invalid if the request fails
    }
  };

  return (
    <Modal
      aria-labelledby="modal-title"
      aria-describedby="modal-desc"
      open={keyOpen}
      sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
    >
      <Sheet
        variant="outlined"
        sx={{
          maxWidth: 500,
          borderRadius: 'md',
          p: 3,
          boxShadow: 'lg',
          borderColor: isValid ? 'initial' : 'red',
        }}
      >
        <Typography
          component="h2"
          id="modal-title"
          level="h4"
          textColor="inherit"
          fontWeight="lg"
          mb={1}
        >
          Enter your GPT API Key
        </Typography>
        <TextField
          value={apiKey}
          onChange={handleApiKeyChange}
          error={!isValid}
          helperText={!isValid && "Invalid API key. Please try again."}
          fullWidth
        />
        <Button
          onClick={handleSubmit}
          variant="outlined"
          sx={{
            mt: 2,
            display: 'flex',
            justifyContent: 'center',
            mx: 'auto'
          }}
        >
          Submit
        </Button>
      </Sheet>
    </Modal>
  );
}

export default TestKey;
