import { createTheme } from '@mui/material/styles';

export const generateTheme = ({ fontFamily }) => createTheme({
  palette: {
    mode: 'dark',
    primary: {
      light: '#1a1a1a',
      main: '#fff',
      dark: '#002884',
      contrastText: '#fff',
    }
  },
  typography: {
    fontFamily
  },
});