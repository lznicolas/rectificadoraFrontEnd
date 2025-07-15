import React, { useState } from "react";
import {Container, Typography} from '@mui/material'
import FormDireccion from "../components/FormDireccion";
import FormPersona from "../components/FormPersona";
import FormEmpleado from "../components/FormEmpleado";

const Empleados = () =>{
    const [empleado, setEmpleados] = useState([]);
    const [nuevoEmpleado, setNuevoEmpleado] = useState({
        apellido:"",
        nombre:"",
        dni:"",
        cuilt:"",
        telefono:"",
        
    })
}

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
                Direccion
            </Typography>
            <FormDireccion></FormDireccion>
            <Typography variant="h5" sx={{color:"black"}}>
                Datos del Empleado
            </Typography>
            <FormEmpleado></FormEmpleado>
        </Container>
    )

}
export default FormularioCliente
