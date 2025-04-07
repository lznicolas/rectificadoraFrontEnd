import React, { useEffect, useState } from "react";
import { actualizarRepuesto, actualizarStock, obtenerRepuestos,obtenerStock,agregarRepuesto } from "../services/api";
import TablaRepuestos from "../components/TablaRepuestos";
import { Container, Typography,Modal,Box,TextField,Button } from "@mui/material";
import SearchBar from "../components/SearchBar";
import CreateButton from "../components/CreateButton";
const Repuestos = () => {
  const [repuestos, setRepuestos] = useState([]);
  const [modalOpen,setModalOpen] = useState(false);
  const [repuestoSeleccionado, setRepuestosSeleccionado] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [modalAgregaOpen, setModalAgregaOpen] = useState(false);
  const [nuevoRepuesto, setNuevoRepuesto] = useState({
    titulo:"",
    descripcion:"",
    ubicacion:"",
    codigo:""
  });

//Cargar repuesto al inicio
  useEffect(() => {
    const fetchData = async () => {
      try{
        const data = await obtenerRepuestos();
        console.log("Datos obtenidos",data);
        setRepuestos(data);
      }catch(error){
        console.error("Error obteniendo respuestos", error)
      } 
    };
    fetchData();
  }, []);

  //Filtrar repuesto cuando cambia searchText(Barra de busqueda)
  useEffect(()=> {
    const fetchFilteredData = async()=>{
      if (searchText.trim()===""){
        const data = await obtenerRepuestos();
        setRepuestos(data);
        }else{
          const filtered = repuestos.filter(rep =>
          rep.titulo.toLowerCase().includes(searchText.toLowerCase())||
          rep.codigo.toLowerCase().includes(searchText.toLowerCase())
          );
          setFilteredRepuesto(filtered); 
      }
    };
    fetchFilteredData();      
  },[searchText]);

  //Funcion para editar repuesto | Abrir el modal con los datos del repuesto
  const handleEditar = (repuesto) => {
    setRepuestosSeleccionado({...repuesto});
    setModalOpen(true);
  };

  //Funcion para cerrar el modal de edicion
  const handleCloseModal = ()=>{
    setModalOpen(false);
    setRepuestosSeleccionado(null);
  }

  //Manejo de Inputs actulizarRepuesto
  const handleChange = (e)=>{
    if(!repuestoSeleccionado) return;
    setRepuestosSeleccionado((prev)=>({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  //Modal creacion de repuesto
  const handleOpenAgregarModal=()=>{
    setNuevoRepuesto({titulo:"",descripcion:"",ubicacion:"",codigo:""});
    setModalAgregaOpen(true);
  };

  //Modal repuesto cerrar
  const handleCloseAgregarModal = ()=>{
    setModalAgregaOpen(false);
  };

  const handleChangeNuevoRepuesto=(e)=>{
    setNuevoRepuesto({...nuevoRepuesto,
      [e.target.name]: e.target.value
    });
  };

  //GuardarNuevoRepuesto
  const handleGuardarNuevoRepuesto = async () =>{
    try{
      await agregarRepuesto(nuevoRepuesto);
      setModalAgregaOpen(false);
      alert("Repuesto agregado Correctamente");
      handleCloseAgregarModal();
      const data = await obtenerRepuestos();
      setRepuestos(data);
    }catch(error){
      alert("Error al agregar Repuesto");
    }
  };

  //Funcion para guardar los cambios
  const handleGuardar= async() =>{
    if(!repuestoSeleccionado) return;
    try{
      await actualizarRepuesto(repuestoSeleccionado.id, repuestoSeleccionado);
      //Actuliza el repuesto
      setRepuestos((prevRepuestos)=>
      prevRepuestos.map((rep)=> (rep.id === repuestoSeleccionado.id ? repuestoSeleccionado: rep))
    );
      alert("Repuesto actualizado correctamente");
      handleCloseModal();
    }catch (error){
      console.error("Error al actulizar el repuesto",error);
      console.log("Detalles del error", error.response)
      alert("Error al actulizar el repuesto");
    }
  };

  //Funcion para eliminar
  const handleEliminar = (repuesto) =>{
    alert (`Eliminar repuesto con ID: ${repuesto.id}`)
  };
  
  //Funcion para ver y actualizar el stock
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
    <Container sx={{ marginTop: "20px", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <SearchBar onSearch={setSearchText} />
      <CreateButton onClick={handleOpenAgregarModal} />
      <TablaRepuestos
        repuestos={repuestos}
        onEditar={handleEditar}
        onEliminar={handleEliminar}
        onActualizarStock={handleActualizarStock}
      />

      {/* Modal para editar repuesto */}
      <Modal open={modalOpen} onClose={handleCloseModal}>
        <Box sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: 400, bgcolor: "white", p: 4, borderRadius: 2, boxShadow: 24 }}>
          <Typography variant="h6" sx={{ color: "black" }}>Editar Repuesto</Typography>
          <TextField fullWidth margin="normal" label="Título" name="titulo" value={repuestoSeleccionado?.titulo || ""} onChange={handleChange} />
          <TextField fullWidth margin="normal" label="Descripción" name="descripcion" value={repuestoSeleccionado?.descripcion || ""} onChange={handleChange} />
          <TextField fullWidth margin="normal" label="Ubicación" name="ubicacion" value={repuestoSeleccionado?.ubicacion || ""} onChange={handleChange} />
          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, marginTop: 2 }}>
            <Button variant="contained" color="primary" onClick={handleGuardar}>Guardar</Button>
            <Button variant="outlined" color="secondary" onClick={handleCloseModal}>Cancelar</Button>
          </Box>
        </Box>
      </Modal>
      {/* Modal para agregar repuesto */}
      <Modal open={modalAgregaOpen} onClose={handleCloseAgregarModal}>
        <Box sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: 400, bgcolor: "white", p: 4, borderRadius: 2, boxShadow: 24 }}>
          <Typography variant="h6" sx={{color : "black"}}>Agregar Repuesto</Typography>
          <TextField fullWidth margin="normal" label="Título" name="titulo" value={nuevoRepuesto.titulo} onChange={handleChangeNuevoRepuesto} />
          <TextField fullWidth margin="normal" label="Descripción" name="descripcion" value={nuevoRepuesto.descripcion} onChange={handleChangeNuevoRepuesto} />
          <TextField fullWidth margin="normal" label="Ubicación" name="ubicacion" value={nuevoRepuesto.ubicacion} onChange={handleChangeNuevoRepuesto} />
          <TextField fullWidth margin="normal" label="Código" name="codigo" value={nuevoRepuesto.codigo} onChange={handleChangeNuevoRepuesto} />
          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, marginTop: 2 }}>
            <Button variant="contained" color="primary" onClick={handleGuardarNuevoRepuesto}>Guardar</Button>
            <Button variant="outlined" color="secondary" onClick={handleCloseAgregarModal}>Cancelar</Button>
          </Box>
        </Box>
      </Modal>
    </Container>
  );
};

export default Repuestos;
//nlamas
