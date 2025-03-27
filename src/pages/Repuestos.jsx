import React, { useEffect, useState } from "react";
import { actualizarRepuesto, actualizarStock, obtenerRepuestos,obtenerStock } from "../services/api";
import TablaRepuestos from "../components/TablaRepuestos";
import { Container, Typography,Modal,Box,TextField,Button } from "@mui/material";

const Repuestos = () => {
  const [repuestos, setRepuestos] = useState([]);
  const [modalOpen,setModalOpen] = useState(false);
  const [repuestoSeleccionado, setRepuestosSeleccionado] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const data = await obtenerRepuestos();
      console.log("Datos obtenidos",data);
      setRepuestos(data);
    };
    fetchData();
  }, []);

  //Funcion para editar | Abrir el modal con los datos del repuesto
  const handleEditar = (repuesto) => {
    setRepuestosSeleccionado(repuesto);
    setModalOpen(true);
  };

  //Funcion para cerrar el modal
  const handleCloseModal = ()=>{
    setModalOpen(false);
    setRepuestosSeleccionado(null);
  }

  //Manejo de Inputs actulizarRepuesto
  const handleChange = (e)=>{
    setRepuestosSeleccionado({
      ...repuestoSeleccionado,
      [e.target.name]: e.target.value,
    });
  };

  //Funcion para guardar los cambios
  const handleGuardar= async() =>{
    if(!repuestoSeleccionado) return;
    try{
      await actualizarRepuesto(repuestoSeleccionado.id, repuestoSeleccionado);
      //Actuliza el repuesto
      setRepuestos((prevRepuestos)=>
      prevRepuestos.map((rep)=>
        rep.id === repuestoSeleccionado.id ? repuestoSeleccionado: rep
      )
    );
      alert("Repuesto actualizado correctamente");
      handleCloseModal();
    }catch (error){
      console.error("Error al actulizar el repuesto",error);
      console.log("Detalles del error", error.response)
      alert("Error al actulizar el repuesto");
    }
  }

  //Funcion para eliminar
  const handleEliminar = (repuesto) =>{
    alert (`Eliminar repuesto con ID: ${repuesto.id}`)
  };
  
  //Funcion poara ver stock
  const handleActualizarStock = async (codigo)=>{
    const stockResponse = await obtenerStock(codigo);
    const stockActual = stockResponse?.cantidad ?? 0;

    const nuevaCantidad = prompt(`Stock actual: ${stockActual}\nIngrese la nueva cantidad de stock:`);
    if(nuevaCantidad == null){
      return;
    }
    if (nuevaCantidad.trim() === "" || isNaN(nuevaCantidad)){
      alert("Cantidad invalida");
      return;
    }
    try{
      await actualizarStock(codigo,parseInt(nuevaCantidad));
      alert("Stock actualizado correctamente");
    }catch{
      alert("Error al actulizar el stock")
    }
  };


  return (
    <div>
        
        <Container sx={{marginTop:"20px", display:"flex", flexDirection:"column",alignItems:"center"}}>
          <TablaRepuestos repuestos={repuestos} onEditar={handleEditar} onEliminar={handleEliminar} onActualizarStock={handleActualizarStock}/>
        
          {/* Modal para editar repuesto */}
          <Modal open={modalOpen} onClose={handleCloseModal}>
            <Box sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: 400, bgcolor: "white", p: 4, borderRadius: 2, boxShadow: 24 }}>
              <Typography variant="h6" sx={{color : "black"}}>Editar Repuesto</Typography>
              <TextField fullWidth margin="normal" label="Título" name="titulo" value={repuestoSeleccionado?.titulo || ""} onChange={handleChange} />
              <TextField fullWidth margin="normal" label="Descripción" name="descripcion" value={repuestoSeleccionado?.descripcion || ""} onChange={handleChange} />
              <TextField fullWidth margin="normal" label="Ubicacion" name="ubicacion" value={repuestoSeleccionado?.ubicacion || ""} onChange={handleChange} />
              <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, marginTop: 2 }}>
                <Button variant="contained" color="primary" onClick={handleGuardar}>Guardar</Button>
                <Button variant="outlined" color="secondary" onClick={handleCloseModal}>Cancelar</Button>
              </Box>
            </Box>
          </Modal>
        </Container>
    </div>
  );
};

export default Repuestos;
