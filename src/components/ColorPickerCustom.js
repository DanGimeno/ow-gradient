import React, { useState } from 'react';
import { Box, Button, Popover, Paper } from '@mui/material';
import { Circle, Colorful } from '@uiw/react-color';
import ColorLensIcon from '@mui/icons-material/ColorLens';

const PRESET_COLORS = [
  '#FF6B6B',
  '#4ECDC4',
  '#45B7D1',
  '#96CEB4',
  '#FFEEAD',
  '#D4A5A5',
  '#9B9B9B',
  '#3A3A3A',
  '#4A90E2',
  '#43A047',
];

export default function ColorPickerCustom({ value = '#1976d2', onChange }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box>
      <Box mb={2}>
        <Circle
          colors={PRESET_COLORS}
          color={value}
          onChange={(color) => onChange(color.hex)}
        />
      </Box>

      <Box display="flex" alignItems="center" gap={2}>
        <Paper
          sx={{
            width: 45,
            height: 45,
            backgroundColor: value,
            border: '2px solid #fff',
            boxShadow: '0 0 0 1px rgba(0,0,0,0.1)',
            borderRadius: '50%',
          }}
        />

        <Button
          variant="outlined"
          size="small"
          onClick={handleClick}
          startIcon={<ColorLensIcon />}
        >
          Color personalizado
        </Button>

        <Popover
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
        >
          <Box p={2}>
            <Colorful
              style={{ width: 200 }}
              color={value}
              disableAlpha
              onChange={(color) => {
                onChange(color.hex);
                handleClose();
              }}
            />
          </Box>
        </Popover>
      </Box>
    </Box>
  );
}
