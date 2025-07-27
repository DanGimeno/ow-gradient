'use client';
import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteIcon from '@mui/icons-material/Delete';
import { messages } from '@/i18n';

function hexToRgb(hex) {
  const h = hex.replace('#', '');
  return {
    r: parseInt(h.substring(0, 2), 16),
    g: parseInt(h.substring(2, 4), 16),
    b: parseInt(h.substring(4, 6), 16),
  };
}

function rgbToHex(r, g, b) {
  return [r, g, b]
    .map((x) => x.toString(16).padStart(2, '0'))
    .join('')
    .toUpperCase();
}

function generateGradient(text, start, end) {
  const s = hexToRgb(start);
  const e = hexToRgb(end);
  const len = text.length;
  let result = '';
  for (let i = 0; i < len; i += 1) {
    if (text[i] === '<') {
      const j = text.indexOf('>', i);
      if (j !== -1) {
        result += text.slice(i, j + 1);
        i = j;
        continue;
      }
    }
    const t = len === 1 ? 0 : i / (len - 1);
    const r = Math.round(s.r + (e.r - s.r) * t);
    const g = Math.round(s.g + (e.g - s.g) * t);
    const b = Math.round(s.b + (e.b - s.b) * t);
    const hex = rgbToHex(r, g, b);
    result += `<FG${hex}FF>` + text[i];
  }
  return result;
}

export default function GradientForm({ categories }) {
  const [lang, setLang] = useState('en');
  const t = messages[lang];
  const [message, setMessage] = useState('');
  const [startColor, setStartColor] = useState('#ff0000');
  const [endColor, setEndColor] = useState('#0000ff');
  const [code, setCode] = useState('');
  const [favorites, setFavorites] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem('owFavorites');
    if (stored) {
      setFavorites(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    setCode(generateGradient(message, startColor, endColor));
  }, [message, startColor, endColor]);

  const handleCopy = () => navigator.clipboard.writeText(code);

  const handleSave = () => {
    const newFav = [
      ...favorites,
      { id: Date.now(), message, startColor, endColor },
    ];
    setFavorites(newFav);
    localStorage.setItem('owFavorites', JSON.stringify(newFav));
  };

  const handleSelectFavorite = (fav) => {
    setMessage(fav.message);
    setStartColor(fav.startColor);
    setEndColor(fav.endColor);
    setAnchorEl(null);
  };

  const handleDeleteFavorite = (fav) => {
    const newFav = favorites.filter((f) => f.id !== fav.id);
    setFavorites(newFav);
    localStorage.setItem('owFavorites', JSON.stringify(newFav));
  };

  const openMenu = Boolean(anchorEl);

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <FormControl sx={{ mb: 2, minWidth: 120 }} size="small">
          <InputLabel id="lang-label">Lang</InputLabel>
          <Select
            labelId="lang-label"
            value={lang}
            label="Lang"
            onChange={(e) => setLang(e.target.value)}
          >
            <MenuItem value="en">English</MenuItem>
            <MenuItem value="es">Español</MenuItem>
            <MenuItem value="ca">Català</MenuItem>
          </Select>
        </FormControl>
        <Typography variant="body1" sx={{ mb: 2 }}>
          {t.explanation}
        </Typography>
        <TextField
          label={t.messageLabel}
          fullWidth
          multiline
          minRows={2}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          sx={{ mb: 2 }}
        />
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <TextField
            type="color"
            label={t.startColor}
            value={startColor}
            onChange={(e) => setStartColor(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            type="color"
            label={t.endColor}
            value={endColor}
            onChange={(e) => setEndColor(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
        </Box>
        <Grid container spacing={2} sx={{ mb: 2 }}>
          {Object.entries(categories).map(([cat, items]) => (
            <Grid item xs={12} md={3} key={cat}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {cat}
                  </Typography>
                  <Grid container spacing={1}>
                    {items.map((item) => (
                      <Grid item key={item.code}>
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => setMessage((m) => `${m} ${item.code}`)}
                        >
                          {item.label}
                        </Button>
                      </Grid>
                    ))}
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
        <TextField
          label={t.generatedCode}
          fullWidth
          multiline
          minRows={4}
          value={code}
          InputProps={{ readOnly: true }}
        />
        <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
          <Button
            variant="contained"
            onClick={handleCopy}
            startIcon={<ContentCopyIcon />}
          >
            {t.copy}
          </Button>
          <Button
            variant="outlined"
            onClick={handleSave}
            startIcon={<StarIcon />}
          >
            {t.save}
          </Button>
        </Box>
      </Box>
      <IconButton
        sx={{ position: 'fixed', top: 16, right: 16 }}
        onClick={(e) => setAnchorEl(e.currentTarget)}
        color="primary"
      >
        <StarIcon />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={openMenu}
        onClose={() => setAnchorEl(null)}
      >
        <Typography sx={{ px: 2, py: 1 }} variant="subtitle1">
          {t.favorites}
        </Typography>
        {favorites.length === 0 && (
          <MenuItem>{t.noFavorites}</MenuItem>
        )}
        {favorites.map((fav) => (
          <MenuItem key={fav.id}>
            <Box sx={{ flexGrow: 1 }} onClick={() => handleSelectFavorite(fav)}>
              {fav.message}
            </Box>
            <IconButton
              size="small"
              onClick={() =>
                navigator.clipboard.writeText(
                  generateGradient(fav.message, fav.startColor, fav.endColor)
                )
              }
            >
              <ContentCopyIcon fontSize="inherit" />
            </IconButton>
            <IconButton
              size="small"
              onClick={() => handleDeleteFavorite(fav)}
            >
              <DeleteIcon fontSize="inherit" />
            </IconButton>
          </MenuItem>
        ))}
      </Menu>
    </Container>
  );
}
