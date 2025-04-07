import React, { useState } from "react";
import { AppBar,Button,IconButton,Menu,MenuItem,Toolbar,Typography,Box } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

const Header= () =>{
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    
    const handleClick=(event) =>{
        setAnchorEl(event.currentTarget);
    };
    const handleClose = ()=>{
        setAnchorEl(null);
    };
    return(
        <AppBar position="static" sx={{backgroundColor: "primary.main"}} style={{width:"100%"}}>
            <Toolbar>
                <IconButton 
                    size="large"
                    edge="start"
                    color="inherit"
                    aria-label="menu"
                    sx={{mr:2,display:{xs:"block", md:"none"}}}
                    onClick={handleClick}
                >
                <MenuIcon></MenuIcon>
                </IconButton>
                <Menu
                    id="menu-appbar"
                    anchorEl={anchorEl}
                    anchorOrigin={{
                        vertical:"bottom",
                        horizontal:"left"
                    }}
                    keepMounted
                    transformOrigin={{
                        vertical:"top",
                        horizontal:"left"
                    }}
                    open={open}
                    onClose={handleClose}
                >
                    <MenuItem onClick={handleClose}>Sobre Nosotros</MenuItem>
                    <MenuItem onClick={handleClose}>Soluciones</MenuItem>
                    <MenuItem onClick={handleClose}>Contacto</MenuItem>
                </Menu>
                <Typography variant="h6" sx={{flexGrow: 1, textAlign: "center"}}>
                    Taller Rectificadora El Pepe
                </Typography>
                <Box sx={{display:{xs:"none",md:"flex"}}}>
                    <Button color="inherit">Sobre Nosotros</Button>
                    <Button color="inherit">Soluciones</Button>
                    <Button color="inherit">Contacto</Button>
                </Box>
                
                
            </Toolbar>
        </AppBar>
    );
};
export default Header;