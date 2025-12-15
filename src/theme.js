import { createTheme } from "@mui/material";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1E3A8A", // azul base
      light: "#3B82F6",
      dark: "#14275E",
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: "#6B7280", // gris medio
      light: "#9CA3AF",
      dark: "#4B5563",
      contrastText: "#FFFFFF",
    },
    background: {
      default: "#F4F6FB", // gris muy claro
      paper: "#FFFFFF",
    },
    text: {
      primary: "#0F172A", // gris azulado oscuro
      secondary: "#4B5563",
    },
  },
  shape: {
    borderRadius: 12,
  },
  typography: {
    fontFamily: "'Inter', 'Segoe UI', system-ui, -apple-system, sans-serif",
    h1: { fontWeight: 700 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 700 },
    button: { textTransform: "none", fontWeight: 600 },
  },
});
export default theme;
