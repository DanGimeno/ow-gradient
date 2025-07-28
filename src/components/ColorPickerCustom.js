import React, { useState, useEffect } from "react";
import {
  Box,
  Popover,
  Paper,
  Stack,
  TextField,
  InputAdornment,
} from "@mui/material";
import { Circle, Colorful } from "@uiw/react-color";

const PRESET_COLORS = [
  "#FF6B6B",
  "#4ECDC4",
  "#45B7D1",
  "#96CEB4",
  "#FFEEAD",
  "#D4A5A5",
  "#9B9B9B",
  "#3A3A3A",
  "#4A90E2",
  "#43A047",
];

export default function ColorPickerCustom({
  value = "#1976d2",
  alpha = 255,
  onChange,
  onAlphaChange,
}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [recentColors, setRecentColors] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem("owRecentColors");
    if (stored) {
      try {
        setRecentColors(JSON.parse(stored));
      } catch {}
    }
  }, []);

  const updateRecent = (color) => {
    setRecentColors((prev) => {
      const arr = [color, ...prev.filter((c) => c !== color)].slice(0, 10);
      localStorage.setItem("owRecentColors", JSON.stringify(arr));
      return arr;
    });
  };

  const handleColorChange = (hex) => {
    onChange(hex);
    updateRecent(hex);
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box>
      <Box mb={2}>
        <Stack direction="row" alignItems="center" gap={1}>
          <Box display="flex" alignItems="center" gap={2}>
            <Paper
              onClick={handleClick}
              sx={{
                width: 150,
                height: 100,
                backgroundColor: value,
                border: "2px solid #fff",
                boxShadow: "0 0 0 1px rgba(0,0,0,0.1)",
                borderRadius: "4",
                cursor: "pointer",
              }}
            />

            <Popover
              open={open}
              anchorEl={anchorEl}
              onClose={handleClose}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
            >
              <Box p={2}>
                <Colorful
                  style={{ width: 220 }}
                  color={`${value}${alpha.toString(16).padStart(2, "0")}`}
                  onChange={(color) => {
                    handleColorChange(color.hex);
                    if (onAlphaChange && color.hsva) {
                      onAlphaChange(Math.round(color.hsva.a * 255));
                    }
                  }}
                />
              </Box>
            </Popover>
          </Box>
          <Box>
            <Stack direction="column" spacing={1}>
              <TextField
                size="small"
                name="rgb"
                label="RGB"
                value={value.replace("#", "").toUpperCase()}
                onChange={(e) => {
                  const hex = `#${e.target.value.replace(/[^0-9a-f]/gi, "").slice(0, 6).toUpperCase()}`;
                  handleColorChange(hex);
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">#</InputAdornment>
                  ),
                }}
                sx={{ width: 120 }}
              />
              <TextField
                size="small"
                name="alpha"
                label="Alpha"
                type="number"
                value={alpha}
                onChange={(e) => {
                  const a = Math.max(0, Math.min(255, parseInt(e.target.value || 0, 10)));
                  onAlphaChange?.(a);
                }}
                inputProps={{ min: 0, max: 255 }}
                sx={{ width: 70 }}
              />
            </Stack>
          </Box>
        </Stack>
      </Box>
      <Box mb={2}>
        <Circle
          colors={PRESET_COLORS}
          color={value}
          onChange={(color) => handleColorChange(color.hex)}
        />
      </Box>
      {recentColors.length > 0 && (
        <Box mb={2}>
          <Circle
            colors={recentColors}
            color={value}
            onChange={(color) => handleColorChange(color.hex)}
          />
        </Box>
      )}
    </Box>
  );
}
