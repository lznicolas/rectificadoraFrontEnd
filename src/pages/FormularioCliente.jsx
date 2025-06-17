import React from "react";
import {Container, Typography} from '@mui/material'
import FormDireccion from "../components/FormDireccion";
import FormPersona from "../components/FormPersona";
import FormCliente from "../components/FormCliente";

const FormularioCliente = () =>{
    return(
        <Container sx={{ marginTop: "20px", display: "flex", flexDirection: "column", alignItems: "center" }}>
            <Typography variant="h4" sx={{color:"black"}}>
                Alta de Cliente
            </Typography>
            <Typography variant="h5" sx={{color:"black"}}>
                Datos de la Persona
            </Typography>
            <FormPersona></FormPersona>
            <Typography variant="h5" sx={{color:"black"}}>
                Direccion
            </Typography>
            <FormDireccion></FormDireccion>
            <Typography variant="h5" sx={{color:"black"}}>
                Datos del Cliente
            </Typography>
            <FormCliente></FormCliente>
        </Container>
    )
}

export default FormularioCliente