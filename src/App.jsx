import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Box, CssBaseline } from "@mui/material";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Repuestos from "./pages/Repuestos";
import Presentacion from "./pages/Presentacion";
import FormularioCliente from "./pages/FormularioCliente";
import FormularioEmpleado from "./pages/FormularioEmpleado";
import PersonasTabs from "./pages/PersonasTabs";
function App() {
  return (
    <Router>
      <CssBaseline />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
          width: "100vw",
        }}
      >
        {/* Header en la parte superior */}
        <Header />

        {/* Contenido principal centrado */}
        <Box
          sx={{
            flexGrow: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: 3,
          }}
        >
          <Routes>
            <Route path="/repuesto" element={<Repuestos />} />
            <Route path="/home" element={<Presentacion />} />
            <Route path="/formucliente" element={<FormularioCliente />} />
            <Route path="/formuempleado" element={<FormularioEmpleado />} />
            <Route path="/tabpersona" element={<PersonasTabs />} />
          </Routes>
        </Box>

        {/* Footer al final de la página */}
        <Footer />
      </Box>
    </Router>
  );
}

export default App;
