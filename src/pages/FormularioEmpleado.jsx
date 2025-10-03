import React, { useState } from "react";
import {Container, Typography,Button} from '@mui/material'
import FormDireccion from "../components/FormDireccion";
import FormPersona from "../components/FormPersona";
import FormEmpleado from "../components/FormEmpleado";



//Nuevo empleado

const FormularioCliente = () =>{
    return(
        <Container sx={{ marginTop: "20px", display: "flex", flexDirection: "column", alignItems: "center" }}>
            <Typography variant="h4" sx={{color:"black"}}>
                Alta de Empleado
            </Typography>
            <Typography variant="h5" sx={{color:"black"}}>
                Datos de la Persona
            </Typography>
            <FormPersona></FormPersona>
            <Typography variant="h5" sx={{color:"black"}}>
                Datos del Empleado
            </Typography>
            <FormEmpleado></FormEmpleado>
            
        </Container>
        
    )

}
export default FormularioCliente
