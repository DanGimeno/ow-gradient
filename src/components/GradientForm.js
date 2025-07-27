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
  Slider,
} from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteIcon from '@mui/icons-material/Delete';
import { messages } from '@/i18n';
import { ColorModeContext } from '@/theme';

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

function generateGradient(text, start, end, startOpacity, endOpacity) {
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
    const opVal = Math.round(
      startOpacity + (endOpacity - startOpacity) * t,
    );
    const op = opVal.toString(16).padStart(2, '0').toUpperCase();
    result += `<FG${hex}${op}>` + text[i];
  }
  return result;
}

export default function GradientForm({ categories }) {
  const [lang, setLang] = useState('en');
  const t = messages[lang];
  const colorMode = React.useContext(ColorModeContext);
  const [message, setMessage] = useState('');
  const [startColor, setStartColor] = useState('#ff0000');
  const [endColor, setEndColor] = useState('#0000ff');
  const [startOpacity, setStartOpacity] = useState(255);
  const [endOpacity, setEndOpacity] = useState(255);
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
    setCode(
      generateGradient(
        message,
        startColor,
        endColor,
        startOpacity,
        endOpacity,
      ),
    );
  }, [message, startColor, endColor, startOpacity, endOpacity]);

  const handleCopy = () => navigator.clipboard.writeText(code);

  const handleSave = () => {
    const newFav = [
      ...favorites,
      {
        id: Date.now(),
        message,
        startColor,
        endColor,
        startOpacity,
        endOpacity,
      },
    ];
    setFavorites(newFav);
    localStorage.setItem('owFavorites', JSON.stringify(newFav));
  };

  const handleSelectFavorite = (fav) => {
    setMessage(fav.message);
    setStartColor(fav.startColor);
    setEndColor(fav.endColor);
    if (typeof fav.startOpacity === 'number') {
      setStartOpacity(fav.startOpacity);
    }
    if (typeof fav.endOpacity === 'number') {
      setEndOpacity(fav.endOpacity);
    }
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
        <FormControl sx={{ mb: 2, minWidth: 120, mr: 2 }} size="small">
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
        <FormControl sx={{ mb: 2, minWidth: 120 }} size="small">
          <InputLabel id="theme-label">{t.theme}</InputLabel>
          <Select
            labelId="theme-label"
            value={colorMode.mode}
            label={t.theme}
            onChange={(e) => colorMode.setMode(e.target.value)}
          >
            <MenuItem value="system">{t.system}</MenuItem>
            <MenuItem value="light">{t.light}</MenuItem>
            <MenuItem value="dark">{t.dark}</MenuItem>
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
        <Box sx={{ display: 'flex', gap: 4, mb: 2 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
            <Button
              variant="outlined"
              component="label"
              startIcon={
                <Box sx={{ width: 16, height: 16, bgcolor: startColor, border: 1, borderColor: 'divider' }} />
              }
            >
              {t.startColor}
              <input
                type="color"
                hidden
                value={startColor}
                onChange={(e) => setStartColor(e.target.value)}
              />
            </Button>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
            <Button
              variant="outlined"
              component="label"
              startIcon={
                <Box sx={{ width: 16, height: 16, bgcolor: endColor, border: 1, borderColor: 'divider' }} />
              }
            >
              {t.endColor}
              <input
                type="color"
                hidden
                value={endColor}
                onChange={(e) => setEndColor(e.target.value)}
              />
            </Button>
          </Box>
        </Box>
        <Box sx={{ mb: 2, display: 'flex', gap: 4 }}>
          <Box sx={{ flex: 1 }}>
            <Typography gutterBottom>{t.startOpacity}</Typography>
            <Slider
              value={startOpacity}
              min={0}
              max={255}
              onChange={(e, v) => setStartOpacity(v)}
            />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography gutterBottom>{t.endOpacity}</Typography>
            <Slider
              value={endOpacity}
              min={0}
              max={255}
              onChange={(e, v) => setEndOpacity(v)}
            />
          </Box>
        </Box>
        <Grid container spacing={2} sx={{ mb: 2, flexWrap: 'nowrap', overflowX: 'auto' }}>
          {Object.entries(categories).map(([cat, items]) => (
            <Grid item xs={3} key={cat}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {cat}
                  </Typography>
                  <Box sx={{ maxHeight: 200, overflowY: 'auto' }}>
                    {items.map((item) => (
                      <Button
                        key={item.code}
                        size="small"
                        variant="outlined"
                        onClick={() => setMessage((m) => `${m} ${item.code}`)}
                        fullWidth
                        sx={{ mb: 0.5 }}
                      >
                        {item.label}
                      </Button>
                    ))}
                  </Box>
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
                  generateGradient(
                    fav.message,
                    fav.startColor,
                    fav.endColor,
                    typeof fav.startOpacity === 'number'
                      ? fav.startOpacity
                      : 255,
                    typeof fav.endOpacity === 'number' ? fav.endOpacity : 255,
                  )
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
