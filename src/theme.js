'use client';
import React from 'react';
import { Roboto } from 'next/font/google';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import useMediaQuery from '@mui/material/useMediaQuery';

const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
});

export const ColorModeContext = React.createContext({
  mode: 'system',
  setMode: () => {},
});

export function getTheme(mode) {
  return createTheme({
    cssVariables: true,
    palette: {
      mode,
      primary: { main: '#218ffe' },
      secondary: { main: '#f99e1a' },
      background: {
        default: mode === 'dark' ? '#000000' : '#ffffff',
        paper: mode === 'dark' ? '#43484c' : '#ffffff',
      },
      text: {
        primary: mode === 'dark' ? '#ffffff' : '#000000',
        secondary: mode === 'dark' ? '#f99e1a' : '#405275',
      },
    },
    shape: { borderRadius: 8 },
    typography: {
      fontFamily: roboto.style.fontFamily,
      h6: { fontWeight: 700 },
    },
    components: {
      MuiAlert: {
        styleOverrides: {
          root: {
            variants: [
              {
                props: { severity: 'info' },
                style: {
                  backgroundColor: '#60a5fa',
                },
              },
            ],
          },
        },
      },
    },
  });
}

export default function ThemeRegistry({ children }) {
  const prefersDark = useMediaQuery('(prefers-color-scheme: dark)');
  const [mode, setMode] = React.useState('system');
  const activeMode = mode === 'system' ? (prefersDark ? 'dark' : 'light') : mode;

  const theme = React.useMemo(() => getTheme(activeMode), [activeMode]);

  return (
    <ColorModeContext.Provider value={{ mode, setMode }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}
