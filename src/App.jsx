import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Box, CssBaseline } from "@mui/material";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Repuestos from "./pages/Repuestos";

function App() {
  return (
    <Router>
      <CssBaseline/>
      <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh", width : "100vw"}}>
        {/* Header en la parte superior */}
        <Header />

        {/* Contenido principal centrado */}
        <Box sx={{ flexGrow: 1, display: "flex", justifyContent: "center", alignItems: "center", padding: 3 }}>
          <Routes>
            <Route path="/" element={<Repuestos />} />
          </Routes>
        </Box>

        {/* Footer al final de la página */}
        <Footer />
      </Box>
    </Router>
  );
}

export default App;
