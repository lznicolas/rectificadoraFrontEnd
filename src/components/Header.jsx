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
      sx={{ backgroundColor: "primary.main", width: "100%" }}
    >
      <Toolbar>
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
            <MenuItem onClick={() => goTo("/personas")}>Personas</MenuItem>
            <MenuItem disabled>Trabajos (en construcción)</MenuItem>
          </Menu>
          <MenuItem onClick={() => goTo("/tabpersona")}>Contacto</MenuItem>
        </Menu>

        {/* Título */}
        <Typography variant="h6" sx={{ flexGrow: 1, textAlign: "center" }}>
          Taller Rectificadora MOYANO
        </Typography>

        {/* Botones Desktop */}
        <Box sx={{ display: { xs: "none", md: "flex" }, gap: 2 }}>
          <Button color="inherit" onClick={() => goTo("/home")}>
            Sobre Nosotros
          </Button>

          <Button
            color="inherit"
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
            <MenuItem disabled>Trabajos (en construcción)</MenuItem>
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
