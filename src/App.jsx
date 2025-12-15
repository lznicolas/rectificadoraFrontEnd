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
import Trabajos from "./pages/Trabajos";
import "./App.css";
function App() {
  return (
    <Router>
      <CssBaseline />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
          width: "100%",
          background:
            "linear-gradient(135deg, rgba(30,58,138,0.08) 0%, rgba(59,130,246,0.08) 35%, rgba(244,246,251,0.9) 100%)",
        }}
      >
        <Header />

        <Box
          className="page-shell"
          sx={{
            flexGrow: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-start",
            paddingTop: 4,
            paddingBottom: 4,
          }}
        >
          <Routes>
            <Route path="/repuesto" element={<Repuestos />} />
            <Route path="/home" element={<Presentacion />} />
            <Route path="/formucliente" element={<FormularioCliente />} />
            <Route path="/formuempleado" element={<FormularioEmpleado />} />
            <Route path="/tabpersona" element={<PersonasTabs />} />
            <Route path="/trabajos" element={<Trabajos />} />
          </Routes>
        </Box>

        {/* Footer al final de la página */}
        <Footer />
      </Box>
    </Router>
  );
}

export default App;
