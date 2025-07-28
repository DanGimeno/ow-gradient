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
  Stack,
  IconButton,
  Menu,
  MenuItem,
  Divider,
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DeleteIcon from "@mui/icons-material/Delete";
import { messages } from "@/i18n";
import { ColorModeContext } from "@/theme";
import TranslateIcon from "@mui/icons-material/Translate";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import ColorPickerCustom from "./ColorPickerCustom";

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
  for (let i = 0; i < len; i++) {
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
    const alpha = Math.round(startOpacity + (endOpacity - startOpacity) * t)
      .toString(16)
      .padStart(2, "0")
      .toUpperCase();
    result += `<FG${hex}${alpha}>${text[i]}`;
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
    if (stored) setFavorites(JSON.parse(stored));
  }, []);

  useEffect(() => {
    const icons = (message.match(/<tx[^>]+>/gi) || []).length;
    const textOnly = message.replace(/<tx[^>]+>/gi, "");
    const count = textOnly.length;
    const limits = [15, 13, 12, 10, 9];
    const limit = limits[Math.min(icons, limits.length - 1)];
    setIconCount(icons);
    setCharCount(count);
    setCharLimit(limit);
    setError(
      icons > 4 ? t.tooManyIcons : count > limit ? t.charLimitExceeded : ""
    );
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
    if (typeof fav.startOpacity === "number") setStartOpacity(fav.startOpacity);
    if (typeof fav.endOpacity === "number") setEndOpacity(fav.endOpacity);
    setAnchorEl(null);
  };

  const handleDeleteFavorite = (fav) => {
    const filtered = favorites.filter((f) => f.id !== fav.id);
    setFavorites(filtered);
    localStorage.setItem("owFavorites", JSON.stringify(filtered));
  };
  const anchoColor = 250;

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
          error={Boolean(error)}
          helperText={
            error ||
            `${iconCount} ${t.icons}, ${charCount}/${charLimit} ${t.chars}`
          }
        />
      </Box>
      <Box sx={{ my: 4 }}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 3 }}>
            <Stack spacing={2}>
              <Card
                sx={{
                  border: 1,
                  borderColor: "primary.main",
                  minHeight: 250,
                  height: 250,
                  maxHeight: 250,
                  minWidth: { xs: 380, sm: anchoColor },
                }}
                elevation={0}
              >
                <CardHeader
                  title={t.startColor}
                  sx={{
                    bgcolor: "primary.main",
                    color: "primary.contrastText",
                    textAlign: "center",
                    p: 1,
                  }}
                />
                <CardContent>
                  <ColorPickerCustom
                    value={startColor}
                    alpha={startOpacity}
                    onChange={setStartColor}
                    onAlphaChange={setStartOpacity}
                  />
                </CardContent>
              </Card>
              <Card
                sx={{
                  border: 1,
                  borderColor: "primary.main",
                  minHeight: 250,
                  height: 250,
                  maxHeight: 250,
                  minWidth: { xs: 380, sm: anchoColor },
                }}
                elevation={0}
              >
                <CardHeader
                  title={t.endColor}
                  sx={{
                    bgcolor: "primary.main",
                    color: "primary.contrastText",
                    textAlign: "center",
                    p: 1,
                  }}
                />
                <CardContent>
                  <ColorPickerCustom
                    value={endColor}
                    alpha={endOpacity}
                    onChange={setEndColor}
                    onAlphaChange={setEndOpacity}
                  />
                </CardContent>
              </Card>
            </Stack>
          </Grid>
          <Grid size={{ xs: 12, md: 9 }}>
            <Grid container spacing={2}>
              {Object.entries(categories).map(([cat, items]) => (
                <Grid key={cat} size={{ xs: 12, sm: 6 }}>
                  <Card
                    sx={{ border: 1, borderColor: "primary.main" }}
                    elevation={0}
                  >
                    <CardHeader
                      title={cat}
                      sx={{
                        bgcolor: "primary.main",
                        color: "primary.contrastText",
                        textAlign: "center",
                        p: 1,
                      }}
                    />
                    <CardContent sx={{ maxHeight: 200, overflowY: "auto" }}>
                      {items.map((item) => (
                        <Box key={item.code} sx={{ display: "flex", mb: 0.5 }}>
                          <Button
                            fullWidth
                            size="small"
                            variant="outlined"
                            onClick={() =>
                              setMessage((m) => `${m} ${item.code}`)
                            }
                          >
                            {item.label}
                          </Button>
                          <Button
                            size="small"
                            variant="contained"
                            color="primary"
                            onClick={() =>
                              navigator.clipboard.writeText(item.code)
                            }
                            sx={{
                              minWidth: 0,
                              width: (theme) => theme.spacing(4.5),
                              ml: 0.5,
                            }}
                          >
                            <ContentCopyIcon fontSize="small" />
                          </Button>
                        </Box>
                      ))}
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </Box>
      <Box sx={{ my: 4 }}>
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
        open={Boolean(anchorEl)}
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
                    fav.startOpacity,
                    fav.endOpacity
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
          <TranslateIcon />
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
          <Brightness4Icon />
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
