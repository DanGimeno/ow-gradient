import React, { useState } from 'react';
import { Box, Popover, Paper } from '@mui/material';
import { Circle, Colorful } from '@uiw/react-color';

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

export default function ColorPickerCustom({
  value = '#1976d2',
  alpha = 255,
  onChange,
  onAlphaChange,
}) {
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
          onClick={handleClick}
          sx={{
            width: 60,
            height: 60,
            backgroundColor: value,
            border: '2px solid #fff',
            boxShadow: '0 0 0 1px rgba(0,0,0,0.1)',
            borderRadius: '50%',
            cursor: 'pointer',
          }}
        />

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
              style={{ width: 220 }}
              color={`${value}${alpha.toString(16).padStart(2, '0')}`}
              onChange={(color) => {
                onChange(color.hex);
                if (onAlphaChange && color.hsva) {
                  onAlphaChange(Math.round(color.hsva.a * 255));
                }
              }}
            />
          </Box>
        </Popover>
      </Box>
    </Box>
  );
}
