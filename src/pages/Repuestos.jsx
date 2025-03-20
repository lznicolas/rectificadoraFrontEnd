import React, { useEffect, useState } from "react";
import { obtenerRepuestos } from "../services/api";
import TablaRepuestos from "../components/TablaRepuestos";
import { Container, Typography } from "@mui/material";

const Repuestos = () => {
  const [repuestos, setRepuestos] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await obtenerRepuestos();
      setRepuestos(data);
    };
    fetchData();
  }, []);

  //Funcion para editar
  const handleEditar = (repuesto) => {
    alert(`Editar Repuesto: ${repuesto.titulo}`);
  };

  //Funcion para eliminar
  const handleEliminar = (repuesto) =>{
    alert (`Eliminar repuesto con ID: ${id}`)
  };
  
  //Funcion poara ver stock
  const handleVerStock = (codigo)=>{
    alert (`Ver stock del repuesto con codigo: ${codigo}`);
  };
  return (
    <div>
        
        <Container sx={{marginTop:"20px", display:"flex", flexDirection:"column",alignItems:"center"}}>
        <TablaRepuestos repuestos={repuestos} onEditar={handleEditar} onEliminar={handleEliminar} onVerStock={handleVerStock}/>
        </Container>
        
    </div>
  );
};

export default Repuestos;
