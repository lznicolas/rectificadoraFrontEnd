import React, { useEffect, useState } from "react";
import { actualizarArticulo, actualizarStock, obtenerArticulos, obtenerStock, agregarArticulo, eliminarArticulo } from "../services/api";
import TablaArticulos from "../components/TablaArticulos";
import { Container, Typography,Modal,Box,TextField,Button, FormControl, MenuItem,Select,InputLabel, Paper, Stack, Divider } from "@mui/material";
import SearchBar from "../components/SearchBar";
import CreateButton from "../components/CreateButton";
const Articulos = () => {
  const [articulos, setArticulos] = useState([]);
  const [todosLosArticulos, setTodosLosArticulos] = useState([]);
  const [modalOpen,setModalOpen] = useState(false);
  const [articuloSeleccionado, setArticuloSeleccionado] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [modalAgregaOpen, setModalAgregaOpen] = useState(false);
  const [modalEliminarOpen, setModalEliminarOpen] = useState(false);
  const [articuloAEliminar, setArticuloAEliminar] = useState(null);
  const [stockModalOpen, setStockModalOpen] = useState(false);
  const [stockSeleccionado, setStockSeleccionado] = useState(null);
  const [stockActual, setStockActual] = useState(0);
  const [ajusteStock, setAjusteStock] = useState("");
  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [nuevoArticulo, setNuevoArticulo] = useState({
    titulo:"",
    descripcion:"",
    ubicacion:"",
    codigoDeProducto:"",
    precioUnitario:"",
    categoria:""
  });

//Cargar articulos al inicio
  useEffect(() => {
    const fetchData = async () => {
      try{
        const data = await obtenerArticulos();
        console.log("Datos obtenidos",data);
        setArticulos(data);
        setTodosLosArticulos(data);
      }catch(error){
        console.error("Error obteniendo articulos", error)
      } 
    };
    fetchData();
  }, []);

  //Filtrar articulos cuando cambia searchText(Barra de busqueda)
  useEffect(()=> {
    if (searchText.trim() === ""){
      setArticulos(todosLosArticulos);
    }else{
      const filtered = todosLosArticulos.filter((rep)=>
      rep.titulo.toLowerCase().includes(searchText.toLowerCase())||
    rep.codigoDeProducto.toLowerCase().includes(searchText.toLowerCase())
  );
  setArticulos(filtered);
    }
  },[searchText, todosLosArticulos]);

  //Funcion para editar articulo | Abrir el modal con los datos del articulo
  const handleEditar = (articulo) => {
    setArticuloSeleccionado({...articulo});
    setModalOpen(true);
  };

  //Funcion para cerrar el modal de edicion
  const handleCloseModal = ()=>{
    setModalOpen(false);
    setArticuloSeleccionado(null);
  }

  //Manejo de Inputs actualizarArticulo
  const handleChange = (e)=>{
    if(!articuloSeleccionado) return;
    setArticuloSeleccionado((prev)=>({
      ...prev,
      [e.target.name]: e.target.name === "precioUnitario" ? e.target.value : e.target.value,
    }));
  };

  //Modal creacion de articulo
  const handleOpenAgregarModal=()=>{
    setNuevoArticulo({titulo:"",descripcion:"",ubicacion:"",codigoDeProducto:"", precioUnitario:"", categoria:""});
    setModalAgregaOpen(true);
  };

  //Modal articulo cerrar
  const handleCloseAgregarModal = ()=>{
    setModalAgregaOpen(false);
  };

  const handleChangeNuevoArticulo=(e)=>{
    setNuevoArticulo({...nuevoArticulo,
      [e.target.name]: e.target.value
    });
  };

  //GuardarNuevoArticulo
  const handleGuardarNuevoArticulo = async () =>{
    try{
      await agregarArticulo(nuevoArticulo);
      setModalAgregaOpen(false);
      alert("Articulo agregado correctamente");
      handleCloseAgregarModal();
      const data = await obtenerArticulos();
      setArticulos(data);
    }catch(error){
      alert("Error al agregar articulo");
    }
  };

  //Funcion para guardar los cambios
  const handleGuardar= async() =>{
    if(!articuloSeleccionado) return;
    try{
      await actualizarArticulo(articuloSeleccionado.id, articuloSeleccionado);
      //Actuliza el articulo
      setArticulos((prevArticulos)=>
      prevArticulos.map((rep)=> (rep.id === articuloSeleccionado.id ? articuloSeleccionado: rep))
    );
      alert("Articulo actualizado correctamente");
      handleCloseModal();
    }catch (error){
      console.error("Error al actulizar el articulo",error);
      console.log("Detalles del error", error.response)
      alert("Error al actualizar el articulo");
    }
  };

  //Funcion para ver y actualizar el stock
  const handleActualizarStock = async (articulo)=>{
    setStockSeleccionado(articulo);
    setAjusteStock("");
    setStockModalOpen(true);
    try{
      const stockResponse = await obtenerStock(articulo.codigoDeProducto);
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
    
//Eliminar articulo
  const handleEliminar = (articulo)=>{
    setArticuloAEliminar(articulo);
    setModalEliminarOpen(true);
  };

  const handleCloseEliminarModal = ()=>{
    setModalEliminarOpen(false);
    setArticuloAEliminar(null);
  };

  const handleCloseErrorModal = () => {
    setErrorModalOpen(false);
    setErrorMessage("");
  };

  const handleConfirmarEliminar = async ()=>{
    if(!articuloAEliminar) return;
    try{
      await eliminarArticulo(articuloAEliminar.id);
      setArticulos(prev => prev.filter(r => r.id !== articuloAEliminar.id));
      alert("Articulo eliminado correctamente");
    }catch(error){
      const apiMessage = error.response?.data;
      const parsedMessage = typeof apiMessage === "string"
        ? apiMessage
        : apiMessage?.message || apiMessage?.detalle;

      setErrorMessage(
        parsedMessage ||
        "No se puede eliminar el articulo porque tiene stock registrado. Ajusta el stock a 0 antes de eliminarlo."
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
              Articulos y stock
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

        <TablaArticulos
          articulos={articulos}
          onEditar={handleEditar}
          onEliminar={handleEliminar}
          onActualizarStock={handleActualizarStock}
        />
      </Paper>

      {/* Modal para editar articulo */}
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
            Editar articulo
          </Typography>
          <TextField fullWidth margin="normal" label="Título" name="titulo" value={articuloSeleccionado?.titulo || ""} onChange={handleChange} />
          <TextField fullWidth margin="normal" label="Descripción" name="descripcion" value={articuloSeleccionado?.descripcion || ""} onChange={handleChange} />
          <TextField
            fullWidth
            margin="normal"
            label="Precio unitario"
            name="precioUnitario"
            type="number"
            inputProps={{ min: 0, step: "0.01" }}
            value={articuloSeleccionado?.precioUnitario ?? ""}
            onChange={handleChange}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Categoria</InputLabel>
            <Select
              name="categoria"
              value={articuloSeleccionado?.categoria || ""}
              label="Categoria"
              onChange={handleChange}
            >
              <MenuItem value="REPUESTO">REPUESTO</MenuItem>
              <MenuItem value="CONSUMIBLE">CONSUMIBLE</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel>Ubicación</InputLabel>
            <Select name="ubicacion"
                    value={articuloSeleccionado?.ubicacion || ""}
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
      {/* Modal para agregar articulo */}
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
          <Typography variant="h6" sx={{color : "primary.main", fontWeight: 700}}>Agregar articulo</Typography>
          <TextField fullWidth margin="normal" label="Título" name="titulo" value={nuevoArticulo.titulo} onChange={handleChangeNuevoArticulo} />
          <TextField fullWidth margin="normal" label="Descripción" name="descripcion" value={nuevoArticulo.descripcion} onChange={handleChangeNuevoArticulo} />
          <TextField
            fullWidth
            margin="normal"
            label="Precio unitario"
            name="precioUnitario"
            type="number"
            inputProps={{ min: 0, step: "0.01" }}
            value={nuevoArticulo.precioUnitario}
            onChange={handleChangeNuevoArticulo}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Categoria</InputLabel>
            <Select
              name="categoria"
              value={nuevoArticulo.categoria}
              label="Categoria"
              onChange={handleChangeNuevoArticulo}
            >
              <MenuItem value="REPUESTO">REPUESTO</MenuItem>
              <MenuItem value="CONSUMIBLE">CONSUMIBLE</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel>Ubicación</InputLabel>
            <Select name="ubicacion"
                    value={nuevoArticulo.ubicacion}
                    label="Ubicacion"
                    onChange={handleChangeNuevoArticulo}>
                      <MenuItem value="ALTA">ALTA</MenuItem>
                      <MenuItem value="MEDIA">MEDIA</MenuItem>
                      <MenuItem value="BAJA">BAJA</MenuItem>
                      <MenuItem value="NINGUNA">NINGUNA</MenuItem>
                    </Select>
          </FormControl>
          <TextField fullWidth margin="normal" label="Código" name="codigoDeProducto" value={nuevoArticulo.codigoDeProducto} onChange={handleChangeNuevoArticulo} />
          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, marginTop: 2 }}>
            <Button variant="contained" color="primary" onClick={handleGuardarNuevoArticulo}>Guardar</Button>
            <Button variant="outlined" color="secondary" onClick={handleCloseAgregarModal}>Cancelar</Button>
          </Box>
        </Box>
      </Modal>

      {/* Modal Eliminar articulo */}
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
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>Eliminar articulo</Typography>
          <Typography variant="body2" sx={{ mb: 3 }}>
            ¿Seguro deseas eliminar{" "}
            <strong>{articuloAEliminar?.titulo}</strong>? Esta acción no se puede deshacer.
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
          <Typography variant="h6" sx={{ fontWeight: 700, color: "primary.main" }}>Stock de articulo</Typography>
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
            No se puede eliminar el articulo
          </Typography>
          <Typography variant="body2" sx={{ mt: 1, mb: 3 }}>
            {errorMessage || "Ocurrió un problema al eliminar el articulo."}
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <Button variant="contained" onClick={handleCloseErrorModal}>Entendido</Button>
          </Box>
        </Box>
      </Modal>
    </Container>
  );
};

export default Articulos;
//nlamas
