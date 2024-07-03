import * as React from 'react';
import PropTypes from 'prop-types';
import { Select, MenuItem, FormControl, InputLabel } from '@mui/material';

const confidenceLevels = [
  { value: 1, label: '0 - Not at all confident' },
  { value: 2, label: '1' },
  { value: 3, label: '2' },
  { value: 4, label: '3' },
  { value: 5, label: '4' },
  { value: 6, label: '5 - Completely confident' },
];

function ConfidenceDropdown({ confidenceRating, setConfidenceRating }) {
  return (
    <FormControl fullWidth variant="outlined">
      <InputLabel id="confidence-select-label">Confidence in your answer</InputLabel>
      <Select
        labelId="confidence-select-label"
        value={confidenceRating}
        onChange={(event) => setConfidenceRating(event.target.value)}
        label="Confidence in your answer"
      >
        {confidenceLevels.map((level) => (
          <MenuItem key={level.value} value={level.value}>
            {level.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

ConfidenceDropdown.propTypes = {
  confidenceRating: PropTypes.number.isRequired,
  setConfidenceRating: PropTypes.func.isRequired,
};

export default ConfidenceDropdown;
