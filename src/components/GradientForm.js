"use client";
import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  TextField,
  Button,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  Slider,
  InputAdornment,
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DeleteIcon from "@mui/icons-material/Delete";
import { messages } from "@/i18n";
import { ColorModeContext } from "@/theme";
import TranslateIcon from "@mui/icons-material/Translate";
import Brightness4Icon from "@mui/icons-material/Brightness4";

function hexToRgb(hex) {
  const h = hex.replace("#", "");
  return {
    r: parseInt(h.substring(0, 2), 16),
    g: parseInt(h.substring(2, 4), 16),
    b: parseInt(h.substring(4, 6), 16),
  };
}

function rgbToHex(r, g, b) {
  return [r, g, b]
    .map((x) => x.toString(16).padStart(2, "0"))
    .join("")
    .toUpperCase();
}

function generateGradient(text, start, end, startOpacity, endOpacity) {
  const s = hexToRgb(start);
  const e = hexToRgb(end);
  const len = text.length;
  let result = "";
  for (let i = 0; i < len; i += 1) {
    if (text[i] === "<") {
      const j = text.indexOf(">", i);
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
    const opVal = Math.round(startOpacity + (endOpacity - startOpacity) * t);
    const op = opVal.toString(16).padStart(2, "0").toUpperCase();
    result += `<FG${hex}${op}>` + text[i];
  }
  return result;
}

export default function GradientForm({ categories }) {
  const [lang, setLang] = useState("en");
  const t = messages[lang];
  const colorMode = React.useContext(ColorModeContext);
  const [message, setMessage] = useState("");
  const [startColor, setStartColor] = useState("#ff0000");
  const [endColor, setEndColor] = useState("#0000ff");
  const [startOpacity, setStartOpacity] = useState(255);
  const [endOpacity, setEndOpacity] = useState(255);
  const [code, setCode] = useState("");
  const [favorites, setFavorites] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [langAnchor, setLangAnchor] = useState(null);
  const [themeAnchor, setThemeAnchor] = useState(null);
  const [error, setError] = useState("");
  const [iconCount, setIconCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [charLimit, setCharLimit] = useState(15);

  useEffect(() => {
    const stored = localStorage.getItem("owFavorites");
    if (stored) {
      setFavorites(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    const icons = (message.match(/<tx[^>]+>/gi) || []).length;
    const textOnly = message.replace(/<tx[^>]+>/gi, "");
    const count = textOnly.length;
    const limits = [15, 13, 12, 10, 9];
    const limit = limits[Math.min(icons, 4)];
    setIconCount(icons);
    setCharCount(count);
    setCharLimit(limit);
    if (icons > 4) {
      setError(t.tooManyIcons);
    } else if (count > limit) {
      setError(t.charLimitExceeded);
    } else {
      setError("");
    }
  }, [message, t]);

  useEffect(() => {
    setCode(
      generateGradient(message, startColor, endColor, startOpacity, endOpacity)
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
    localStorage.setItem("owFavorites", JSON.stringify(newFav));
  };

  const handleSelectFavorite = (fav) => {
    setMessage(fav.message);
    setStartColor(fav.startColor);
    setEndColor(fav.endColor);
    if (typeof fav.startOpacity === "number") {
      setStartOpacity(fav.startOpacity);
    }
    if (typeof fav.endOpacity === "number") {
      setEndOpacity(fav.endOpacity);
    }
    setAnchorEl(null);
  };

  const handleDeleteFavorite = (fav) => {
    const newFav = favorites.filter((f) => f.id !== fav.id);
    setFavorites(newFav);
    localStorage.setItem("owFavorites", JSON.stringify(newFav));
  };

  const openMenu = Boolean(anchorEl);

  return (
    <Container maxWidth="xl">
      <Box sx={{ my: 4 }}>
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
          error={Boolean(error)}
          helperText={
            error ||
            `${iconCount} ${t.icons}, ${charCount}/${charLimit} ${t.chars}`
          }
        />
        <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
          <Card
            sx={{ flex: 1, border: 1, borderColor: "primary.main" }}
            elevation={0}
          >
            <CardHeader
              title={t.startColor}
              sx={{
                bgcolor: "primary.main",
                color: "primary.contrastText",
                p: 1,
                textAlign: "center",
              }}
            />
            <CardContent>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}
              >
                <Button
                  variant="outlined"
                  component="label"
                  startIcon={
                    <Box
                      sx={{
                        width: 16,
                        height: 16,
                        bgcolor: startColor,
                        border: 1,
                        borderColor: "divider",
                      }}
                    />
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
                <TextField
                  size="small"
                  value={startColor.slice(1).toUpperCase()}
                  InputProps={{
                    readOnly: true,
                    startAdornment: (
                      <InputAdornment position="start">#</InputAdornment>
                    ),
                  }}
                />
              </Box>
              <Typography gutterBottom>{t.opacity}</Typography>
              <Slider
                value={startOpacity}
                min={0}
                max={255}
                onChange={(e, v) => setStartOpacity(v)}
              />
            </CardContent>
          </Card>
          <Card
            sx={{ flex: 1, border: 1, borderColor: "primary.main" }}
            elevation={0}
          >
            <CardHeader
              title={t.endColor}
              sx={{
                bgcolor: "primary.main",
                color: "primary.contrastText",
                p: 1,
                textAlign: "center",
              }}
            />
            <CardContent>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}
              >
                <Button
                  variant="outlined"
                  component="label"
                  startIcon={
                    <Box
                      sx={{
                        width: 16,
                        height: 16,
                        bgcolor: endColor,
                        border: 1,
                        borderColor: "divider",
                      }}
                    />
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
                <TextField
                  size="small"
                  value={endColor.slice(1).toUpperCase()}
                  InputProps={{
                    readOnly: true,
                    startAdornment: (
                      <InputAdornment position="start">#</InputAdornment>
                    ),
                  }}
                />
              </Box>
              <Typography gutterBottom>{t.opacity}</Typography>
              <Slider
                value={endOpacity}
                min={0}
                max={255}
                onChange={(e, v) => setEndOpacity(v)}
              />
            </CardContent>
          </Card>
        </Box>
        <Grid container spacing={2} columns={24} sx={{ mb: 2 }}>
          {Object.entries(categories).map(([cat, items]) => (
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              lg={3}
              xl={2}
              key={cat}
              sx={{ minWidth: 200, maxWidth: 360 }}
            >
              <Card
                sx={{
                  width: "100%",
                  border: 1,
                  borderColor: "primary.main",
                }}
                elevation={0}
              >
                <CardHeader
                  title={cat}
                  sx={{
                    bgcolor: "primary.main",
                    color: "primary.contrastText",
                    p: 1,
                    textAlign: "center",
                  }}
                />
                <CardContent sx={{ pt: 1 }}>
                  <Box sx={{ maxHeight: 200, overflowY: "auto" }}>
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
        <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
          <Button
            variant="contained"
            onClick={handleCopy}
            startIcon={<ContentCopyIcon />}
            disabled={Boolean(error)}
          >
            {t.copy}
          </Button>
          <Button
            variant="outlined"
            onClick={handleSave}
            startIcon={<StarIcon />}
            disabled={Boolean(error)}
          >
            {t.save}
          </Button>
        </Box>
      </Box>
      <IconButton
        sx={{ position: "fixed", top: 16, right: 16 }}
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
        {favorites.length === 0 && <MenuItem>{t.noFavorites}</MenuItem>}
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
                    typeof fav.startOpacity === "number"
                      ? fav.startOpacity
                      : 255,
                    typeof fav.endOpacity === "number" ? fav.endOpacity : 255
                  )
                )
              }
            >
              <ContentCopyIcon fontSize="inherit" />
            </IconButton>
            <IconButton size="small" onClick={() => handleDeleteFavorite(fav)}>
              <DeleteIcon fontSize="inherit" />
            </IconButton>
          </MenuItem>
        ))}
      </Menu>
      <Box
        sx={{
          position: "fixed",
          bottom: 16,
          right: 16,
          display: "flex",
          flexDirection: "column",
          gap: 1,
        }}
      >
        <IconButton
          size="small"
          onClick={(e) => setLangAnchor(e.currentTarget)}
        >
          <TranslateIcon fontSize="inherit" />
        </IconButton>
        <Menu
          anchorEl={langAnchor}
          open={Boolean(langAnchor)}
          onClose={() => setLangAnchor(null)}
        >
          <MenuItem
            onClick={() => {
              setLang("en");
              setLangAnchor(null);
            }}
          >
            English
          </MenuItem>
          <MenuItem
            onClick={() => {
              setLang("es");
              setLangAnchor(null);
            }}
          >
            Español
          </MenuItem>
          <MenuItem
            onClick={() => {
              setLang("ca");
              setLangAnchor(null);
            }}
          >
            Català
          </MenuItem>
        </Menu>
        <IconButton
          size="small"
          onClick={(e) => setThemeAnchor(e.currentTarget)}
        >
          <Brightness4Icon fontSize="inherit" />
        </IconButton>
        <Menu
          anchorEl={themeAnchor}
          open={Boolean(themeAnchor)}
          onClose={() => setThemeAnchor(null)}
        >
          <MenuItem
            onClick={() => {
              colorMode.setMode("system");
              setThemeAnchor(null);
            }}
          >
            {t.system}
          </MenuItem>
          <MenuItem
            onClick={() => {
              colorMode.setMode("light");
              setThemeAnchor(null);
            }}
          >
            {t.light}
          </MenuItem>
          <MenuItem
            onClick={() => {
              colorMode.setMode("dark");
              setThemeAnchor(null);
            }}
          >
            {t.dark}
          </MenuItem>
        </Menu>
      </Box>
    </Container>
  );
}
