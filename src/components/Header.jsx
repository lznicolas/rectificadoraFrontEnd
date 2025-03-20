import React from "react";
import { AppBar,Toolbar,Typography } from "@mui/material";

const Header= () =>{
    return(
        <AppBar position="static" sx={{backgroundColor: "#8a0bd2"}}>
            <Toolbar>
                <Typography variant="h6" sx={{flexGrow: 1, textAlign: "center"}}>
                    Taller Rectificadora El Pepe
                </Typography>
            </Toolbar>
        </AppBar>
    );
};
export default Header;