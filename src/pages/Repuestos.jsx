import React, { useEffect, useState } from "react";
import { actualizarRepuesto, actualizarStock, obtenerRepuestos,obtenerStock,agregarRepuesto, eliminarRepuesto } from "../services/api";
import TablaRepuestos from "../components/TablaRepuestos";
import { Container, Typography,Modal,Box,TextField,Button, FormControl, MenuItem,Select,InputLabel } from "@mui/material";
import SearchBar from "../components/SearchBar";
import CreateButton from "../components/CreateButton";
const Repuestos = () => {
  const [repuestos, setRepuestos] = useState([]);
  const [todosLosRepuestos, setTodosLosRepuestos] = useState([]);
  const [modalOpen,setModalOpen] = useState(false);
  const [repuestoSeleccionado, setRepuestosSeleccionado] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [modalAgregaOpen, setModalAgregaOpen] = useState(false);
  const [nuevoRepuesto, setNuevoRepuesto] = useState({
    titulo:"",
    descripcion:"",
    ubicacion:"",
    codigoDeProducto:""
  });

//Cargar repuesto al inicio
  useEffect(() => {
    const fetchData = async () => {
      try{
        const data = await obtenerRepuestos();
        console.log("Datos obtenidos",data);
        setRepuestos(data);
        setTodosLosRepuestos(data);
      }catch(error){
        console.error("Error obteniendo respuestos", error)
      } 
    };
    fetchData();
  }, []);

  //Filtrar repuesto cuando cambia searchText(Barra de busqueda)
  useEffect(()=> {
    if (searchText.trim() === ""){
      setRepuestos(todosLosRepuestos);
    }else{
      const filtered = todosLosRepuestos.filter((rep)=>
      rep.titulo.toLowerCase().includes(searchText.toLowerCase())||
    rep.codigoDeProducto.toLowerCase().includes(searchText.toLowerCase())
  );
  setRepuestos(filtered);
    }
  },[searchText, todosLosRepuestos]);

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
    setNuevoRepuesto({titulo:"",descripcion:"",ubicacion:"",codigoDeProducto:""});
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
    
//Eliminar Repuesto
  const handleEliminar = async(repuesto)=>{
    const confirmar = window.confirm(`Estas seguro de que deseas eliminar el repuesto: ${repuesto.titulo}?`);
    if (!confirmar) return
    try{
      await eliminarRepuesto(repuesto.id);
      setRepuestos(prev => prev.filter(r => r.id !== repuesto.id));
      alert("Repuesto eliminado de forma correcta");
    }catch(error){
      alert("Error al eliminar el repuesto");
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
          <FormControl fullWidth margin="normal">
            <InputLabel>Ubicacion</InputLabel>
            <Select name="ubicacion"
                    value={nuevoRepuesto.ubicacion}
                    label="Ubicacion"
                    onChange={handleChange}>
                      <MenuItem value="ALTA">ALTA</MenuItem>
                      <MenuItem value="MEDIA">MEDIA</MenuItem>
                      <MenuItem value="BAJA">BAJA</MenuItem>
                      <MenuItem value="NINGUNA">NINGUNA</MenuItem>
                    </Select>
          </FormControl>
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
          <FormControl fullWidth margin="normal">
            <InputLabel>Ubicacion</InputLabel>
            <Select name="ubicacion"
                    value={nuevoRepuesto.ubicacion}
                    label="Ubicacion"
                    onChange={handleChangeNuevoRepuesto}>
                      <MenuItem value="ALTA">ALTA</MenuItem>
                      <MenuItem value="MEDIA">MEDIA</MenuItem>
                      <MenuItem value="BAJA">BAJA</MenuItem>
                      <MenuItem value="NINGUNA">NINGUNA</MenuItem>
                    </Select>
          </FormControl>
          <TextField fullWidth margin="normal" label="Código" name="codigoDeProducto" value={nuevoRepuesto.codigoDeProducto} onChange={handleChangeNuevoRepuesto} />
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
