import { useState, useRef } from 'react';
import { Button } from '@chatscope/chat-ui-kit-react';
import ButtonGroup from '@mui/material/ButtonGroup';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import Grow from '@mui/material/Grow';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';

const SplitButton = ({ visualizationObject, visualizationObjects, handleSubVisualizationChange, hidden, writingIntro }) => {
  const [open, setOpen] = useState(false);
  const anchorRef = useRef(null);

  const handleClick = () => {
    handleSubVisualizationChange(visualizationObject, visualizationObject.activeSubVisualization);
  };

  const handleMenuItemClick = (option, index) => {
    handleSubVisualizationChange(visualizationObject, option);
    setOpen(false);
  };

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };

  return (
    <div style={{ width: "100%", height: "100%", display: hidden ? "none" : "block" }}>
      <ButtonGroup
        variant="outlined"
        ref={anchorRef}
        aria-label="Button group with a nested menu"
        style={{ width: "100%", height: "100%" }}
      >
        <div style={{ display: "flex", width: "100%" }}>
          <Button
            border
            disabled={writingIntro || !visualizationObject.activeSubVisualization}
            onClick={handleClick}
            style={{
              flex: "3",
              marginRight: "0px",
              marginBottom: "0px",
              borderRadius: "0px",
              backgroundColor: visualizationObject.name === visualizationObjects.activeVisualization ? '#c6e3fa' : "white"
            }}
          >
            {visualizationObject.activeSubVisualization ? visualizationObject.name + ": " + visualizationObject.activeSubVisualization : visualizationObject.name}
          </Button>
          <Button
            border
            disabled={writingIntro}
            height="100%"
            style={{ flex: "1", marginLeft: "0px", marginBottom: "0px", borderRadius: "0px" }}
            aria-controls={open ? 'split-button-menu' : undefined}
            aria-expanded={open ? 'true' : undefined}
            aria-haspopup="menu"
            onClick={handleToggle}
          >
            <ArrowDropDownIcon />
          </Button>
        </div>
      </ButtonGroup>
      <Popper
        sx={{
          zIndex: 1,
        }}
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin:
                placement === 'bottom' ? 'right top' : 'right bottom',
            }}
          >
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList id="split-button-menu" autoFocusItem>
                  {Object.keys(visualizationObject.subVisualizations).map((option, index) => (
                    <MenuItem
                      key={option}
                      selected={option === visualizationObject.activeSubVisualization}
                      onClick={() => handleMenuItemClick(option, index)}
                    >
                      {option}
                    </MenuItem>
                  ))}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </div>
  );
}

export default SplitButton;