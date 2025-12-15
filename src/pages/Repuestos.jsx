import React, { useEffect, useState } from "react";
import { actualizarRepuesto, actualizarStock, obtenerRepuestos,obtenerStock,agregarRepuesto, eliminarRepuesto } from "../services/api";
import TablaRepuestos from "../components/TablaRepuestos";
import { Container, Typography,Modal,Box,TextField,Button, FormControl, MenuItem,Select,InputLabel, Paper, Stack, Divider } from "@mui/material";
import SearchBar from "../components/SearchBar";
import CreateButton from "../components/CreateButton";
const Repuestos = () => {
  const [repuestos, setRepuestos] = useState([]);
  const [todosLosRepuestos, setTodosLosRepuestos] = useState([]);
  const [modalOpen,setModalOpen] = useState(false);
  const [repuestoSeleccionado, setRepuestosSeleccionado] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [modalAgregaOpen, setModalAgregaOpen] = useState(false);
  const [modalEliminarOpen, setModalEliminarOpen] = useState(false);
  const [repuestoAEliminar, setRepuestoAEliminar] = useState(null);
  const [stockModalOpen, setStockModalOpen] = useState(false);
  const [stockSeleccionado, setStockSeleccionado] = useState(null);
  const [stockActual, setStockActual] = useState(0);
  const [ajusteStock, setAjusteStock] = useState("");
  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
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
  const handleActualizarStock = async (repuesto)=>{
    setStockSeleccionado(repuesto);
    setAjusteStock("");
    setStockModalOpen(true);
    try{
      const stockResponse = await obtenerStock(repuesto.codigoDeProducto);
      setStockActual(stockResponse?.cantidad ?? 0);
    }catch(error){
      setStockActual(0);
      console.error("Error al obtener stock", error);
      alert("No se pudo obtener el stock actual");
    }
  };

  const handleCerrarStockModal = ()=>{
    setStockModalOpen(false);
    setStockSeleccionado(null);
    setAjusteStock("");
  };

  const actualizarCantidadStock = async (operacion)=>{
    if(!stockSeleccionado) return;
    const valor = parseInt(ajusteStock,10);
    if(isNaN(valor) || valor <= 0){
      alert("Ingresa una cantidad mayor a 0");
      return;
    }
    const nuevoStock = operacion === "sumar" ? stockActual + valor : stockActual - valor;
    if(nuevoStock < 0){
      setErrorMessage("No se puede restar una cantidad superior a la existente. Por favor intente nuevamente");
      setErrorModalOpen(true);
      return;
    }
    try{
      await actualizarStock(stockSeleccionado.codigoDeProducto,nuevoStock);
      setStockActual(nuevoStock);
      alert("Stock actualizado correctamente");
    }catch(error){
      console.error("Error al actualizar el stock", error);
      alert("Error al actualizar el stock");
    }
  };
    
//Eliminar Repuesto
  const handleEliminar = (repuesto)=>{
    setRepuestoAEliminar(repuesto);
    setModalEliminarOpen(true);
  };

  const handleCloseEliminarModal = ()=>{
    setModalEliminarOpen(false);
    setRepuestoAEliminar(null);
  };

  const handleCloseErrorModal = () => {
    setErrorModalOpen(false);
    setErrorMessage("");
  };

  const handleConfirmarEliminar = async ()=>{
    if(!repuestoAEliminar) return;
    try{
      await eliminarRepuesto(repuestoAEliminar.id);
      setRepuestos(prev => prev.filter(r => r.id !== repuestoAEliminar.id));
      alert("Repuesto eliminado de forma correcta");
    }catch(error){
      const apiMessage = error.response?.data;
      const parsedMessage = typeof apiMessage === "string"
        ? apiMessage
        : apiMessage?.message || apiMessage?.detalle;

      setErrorMessage(
        parsedMessage ||
        "No se puede eliminar el repuesto porque tiene stock registrado. Ajusta el stock a 0 antes de eliminarlo."
      );
      setErrorModalOpen(true);
    }finally{
      handleCloseEliminarModal();
    }
  };
  

  return (
    <Container
      maxWidth="lg"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch",
        gap: 3,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: 3,
          border: "1px solid rgba(30,58,138,0.12)",
          boxShadow: "0 18px 40px rgba(15,23,42,0.08)",
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(244,246,251,0.95) 100%)",
        }}
      >
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={2}
          alignItems={{ xs: "stretch", md: "center" }}
          justifyContent="space-between"
          sx={{ mb: 2 }}
        >
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              Repuestos y stock
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Gestiona el catálogo y las existencias en un solo lugar.
            </Typography>
          </Box>
          <Stack direction="row" spacing={1.5}>
            <SearchBar onSearch={setSearchText} />
            <CreateButton onClick={handleOpenAgregarModal} />
          </Stack>
        </Stack>

        <Divider sx={{ mb: 2 }} />

        <TablaRepuestos
          repuestos={repuestos}
          onEditar={handleEditar}
          onEliminar={handleEliminar}
          onActualizarStock={handleActualizarStock}
        />
      </Paper>

      {/* Modal para editar repuesto */}
      <Modal open={modalOpen} onClose={handleCloseModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 420,
            bgcolor: "background.paper",
            p: 4,
            borderRadius: 3,
            boxShadow: 24,
            border: "1px solid rgba(30,58,138,0.15)",
          }}
        >
          <Typography variant="h6" sx={{ color: "primary.main", fontWeight: 700 }}>
            Editar repuesto
          </Typography>
          <TextField fullWidth margin="normal" label="Título" name="titulo" value={repuestoSeleccionado?.titulo || ""} onChange={handleChange} />
          <TextField fullWidth margin="normal" label="Descripción" name="descripcion" value={repuestoSeleccionado?.descripcion || ""} onChange={handleChange} />
          <FormControl fullWidth margin="normal">
            <InputLabel>Ubicación</InputLabel>
            <Select name="ubicacion"
                    value={repuestoSeleccionado?.ubicacion || ""}
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
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 420,
            bgcolor: "background.paper",
            p: 4,
            borderRadius: 3,
            boxShadow: 24,
            border: "1px solid rgba(30,58,138,0.15)",
          }}
        >
          <Typography variant="h6" sx={{color : "primary.main", fontWeight: 700}}>Agregar repuesto</Typography>
          <TextField fullWidth margin="normal" label="Título" name="titulo" value={nuevoRepuesto.titulo} onChange={handleChangeNuevoRepuesto} />
          <TextField fullWidth margin="normal" label="Descripción" name="descripcion" value={nuevoRepuesto.descripcion} onChange={handleChangeNuevoRepuesto} />
          <FormControl fullWidth margin="normal">
            <InputLabel>Ubicación</InputLabel>
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

      {/* Modal Eliminar repuesto */}
      <Modal open={modalEliminarOpen} onClose={handleCloseEliminarModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            p: 4,
            borderRadius: 3,
            boxShadow: 24,
            border: "1px solid rgba(30,58,138,0.15)",
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>Eliminar repuesto</Typography>
          <Typography variant="body2" sx={{ mb: 3 }}>
            ¿Seguro deseas eliminar{" "}
            <strong>{repuestoAEliminar?.titulo}</strong>? Esta acción no se puede deshacer.
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
            <Button variant="outlined" onClick={handleCloseEliminarModal}>Cancelar</Button>
            <Button variant="contained" color="error" onClick={handleConfirmarEliminar}>Eliminar</Button>
          </Box>
        </Box>
      </Modal>

      {/* Modal Stock */}
      <Modal open={stockModalOpen} onClose={handleCerrarStockModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 420,
            bgcolor: "background.paper",
            p: 4,
            borderRadius: 3,
            boxShadow: 24,
            border: "1px solid rgba(30,58,138,0.15)",
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 700, color: "primary.main" }}>Stock de repuesto</Typography>
          <Typography variant="body2" sx={{ mb: 2 }}>
            {stockSeleccionado?.titulo} ({stockSeleccionado?.codigoDeProducto})
          </Typography>
          <Paper variant="outlined" sx={{ p: 2, mb: 2, borderRadius: 2 }}>
            <Typography variant="subtitle2" color="text.secondary">Stock actual</Typography>
            <Typography variant="h5" sx={{ fontWeight: 800 }}>{stockActual}</Typography>
          </Paper>
          <TextField
            fullWidth
            type="number"
            label="Cantidad a sumar/restar"
            value={ajusteStock}
            onChange={(e)=> setAjusteStock(e.target.value)}
            margin="normal"
          />
          <Stack direction="row" spacing={1} sx={{ mt: 1, justifyContent:"flex-end" }}>
            <Button variant="contained" color="primary" onClick={()=>actualizarCantidadStock("sumar")}>Sumar</Button>
            <Button variant="outlined" color="secondary" onClick={()=>actualizarCantidadStock("restar")}>Restar</Button>
            <Button variant="text" onClick={handleCerrarStockModal}>Cerrar</Button>
          </Stack>
        </Box>
      </Modal>

      {/* Modal Error al eliminar */}
      <Modal open={errorModalOpen} onClose={handleCloseErrorModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 420,
            bgcolor: "background.paper",
            p: 4,
            borderRadius: 3,
            boxShadow: 24,
            border: "1px solid rgba(30,58,138,0.15)",
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 700, color: "error.main" }}>
            No se puede eliminar el repuesto
          </Typography>
          <Typography variant="body2" sx={{ mt: 1, mb: 3 }}>
            {errorMessage || "Ocurrió un problema al eliminar el repuesto."}
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <Button variant="contained" onClick={handleCloseErrorModal}>Entendido</Button>
          </Box>
        </Box>
      </Modal>
    </Container>
  );
};

export default Repuestos;
//nlamas
