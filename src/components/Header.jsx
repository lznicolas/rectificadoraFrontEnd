import React, { useState } from "react";
import {
  AppBar,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
  Box,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorElSoluciones, setAnchorElSoluciones] = useState(null);
  const navigate = useNavigate();

  // --- Menú principal (mobile) ---
  const handleMenuClick = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  // --- Submenú "Soluciones" ---
  const handleSolucionesClick = (event) =>
    setAnchorElSoluciones(event.currentTarget);
  const handleSolucionesClose = () => setAnchorElSoluciones(null);

  // --- Navegación ---
  const goTo = (path) => {
    navigate(path);
    handleSolucionesClose();
    handleMenuClose();
  };

  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        backgroundColor: "transparent",
        backdropFilter: "blur(8px)",
        borderBottom: "1px solid rgba(30,58,138,0.15)",
        boxShadow: "0 10px 30px rgba(17, 24, 39, 0.08)",
      }}
    >
      <Toolbar sx={{ maxWidth: 1280, width: "100%", mx: "auto" }}>
        {/* Botón Hamburguesa (mobile) */}
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2, display: { xs: "block", md: "none" } }}
          onClick={handleMenuClick}
        >
          <MenuIcon />
        </IconButton>

        {/* Menú Mobile */}
        <Menu
          id="menu-appbar"
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
          transformOrigin={{ vertical: "top", horizontal: "left" }}
        >
          <MenuItem onClick={() => goTo("/home")}>Sobre Nosotros</MenuItem>
          <MenuItem onClick={handleSolucionesClick}>
            Soluciones <ArrowDropDownIcon fontSize="small" />
          </MenuItem>
          <Menu
            anchorEl={anchorElSoluciones}
            open={Boolean(anchorElSoluciones)}
            onClose={handleSolucionesClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
            transformOrigin={{ vertical: "top", horizontal: "left" }}
          >
            <MenuItem onClick={() => goTo("/repuesto")}>Repuestos</MenuItem>
            <MenuItem onClick={() => goTo("/tabpersona")}>Personas</MenuItem>
            <MenuItem onClick={() => goTo("/trabajos")}>Trabajos</MenuItem>
          </Menu>
          <MenuItem onClick={() => goTo("/tabpersona")}>Contacto</MenuItem>
        </Menu>

        {/* Título */}
        <Typography
          variant="h6"
          sx={{
            flexGrow: 1,
            textAlign: "center",
            fontWeight: 700,
            letterSpacing: "0.5px",
            color: "primary.main",
          }}
        >
          Taller Rectificadora MOYANO
        </Typography>

        {/* Botones Desktop */}
        <Box sx={{ display: { xs: "none", md: "flex" }, gap: 2 }}>
          <Button color="primary" variant="text" onClick={() => goTo("/home")}>
            Sobre Nosotros
          </Button>

          <Button
            color="primary"
            endIcon={<ArrowDropDownIcon />}
            onClick={handleSolucionesClick}
          >
            Soluciones
          </Button>
          <Menu
            anchorEl={anchorElSoluciones}
            open={Boolean(anchorElSoluciones)}
            onClose={handleSolucionesClose}
          >
            <MenuItem onClick={() => goTo("/repuesto")}>Repuestos</MenuItem>
            <MenuItem onClick={() => goTo("/tabpersona")}>Personas</MenuItem>
            <MenuItem onClick={() => goTo("/trabajos")}>Trabajos</MenuItem>
          </Menu>

          <Button color="inherit" onClick={() => goTo("/contacto")}>
            Contacto
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
