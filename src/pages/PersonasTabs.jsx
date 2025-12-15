import React, { useEffect, useState } from "react";
import {
  Tabs,
  Tab,
  Box,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Stack,
  Container,
  Paper,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  DialogContentText,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  obtenerClientes,
  obtenerEmpleados,
  actualizarCliente,
  actualizarEmpleado,
  eliminarCliente,
  eliminarEmpleado,
} from "../services/api";
import FormCliente from "../components/FormCliente";
import FormEmpleado from "../components/FormEmpleado";

const PersonasTabs = () => {
  const [tabValue, setTabValue] = useState(0);
  const [clientes, setClientes] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const [editOpen, setEditOpen] = useState(false);
  const [editType, setEditType] = useState(null);
  const [editData, setEditData] = useState(null);
  const [addOpen, setAddOpen] = useState(false);
  const [addType, setAddType] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    tipo: null,
    item: null,
  });

  // Cargar datos al iniciar
  const cargarDatos = async () => {
    try {
      const clientesRes = await obtenerClientes();
      const empleadosRes = await obtenerEmpleados();
      setClientes(clientesRes);
      setEmpleados(empleadosRes);
    } catch (error) {
      console.error("Error cargando datos:", error);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const handleDelete = async (tipo, id) => {
    try {
      if (tipo === "cliente") {
        await eliminarCliente(id);
        setClientes((prev) => prev.filter((c) => c.id !== id));
      } else {
        await eliminarEmpleado(id);
        setEmpleados((prev) => prev.filter((e) => e.id !== id));
      }
      alert(`${tipo} eliminado correctamente`);
    } catch (error) {
      console.error(`Error eliminando ${tipo}:`, error);
      alert(`Error eliminando ${tipo}`);
    }
  };

  const openDeleteDialog = (tipo, item) => {
    setDeleteDialog({ open: true, tipo, item });
  };

  const closeDeleteDialog = () => {
    setDeleteDialog({ open: false, tipo: null, item: null });
  };

  const handleConfirmDelete = async () => {
    if (!deleteDialog.tipo || !deleteDialog.item) return;
    await handleDelete(deleteDialog.tipo, deleteDialog.item.id);
    closeDeleteDialog();
  };

  const handleEdit = (tipo, data) => {
    setEditType(tipo);
    setEditData(data);
    setEditOpen(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSave = async () => {
    if (!editData) return;
    try {
      if (editType === "cliente") {
        const updated = await actualizarCliente(editData.id, editData);
        setClientes((prev) =>
          prev.map((c) => (c.id === updated.id ? updated : c))
        );
      } else {
        const updated = await actualizarEmpleado(editData.id, editData);
        setEmpleados((prev) =>
          prev.map((e) => (e.id === updated.id ? updated : e))
        );
      }
      setEditOpen(false);
      setEditData(null);
      setEditType(null);
      alert("Registro actualizado correctamente");
    } catch (error) {
      console.error("Error actualizando:", error);
      alert("Error al actualizar");
    }
  };

  const handleEditClose = () => {
    setEditOpen(false);
    setEditData(null);
    setEditType(null);
  };

  const clienteFields = (
    <>
      <TextField
        margin="dense"
        label="Nombre"
        name="nombre"
        fullWidth
        value={editData?.nombre || ""}
        onChange={handleEditChange}
      />
      <TextField
        margin="dense"
        label="Apellido"
        name="apellido"
        fullWidth
        value={editData?.apellido || ""}
        onChange={handleEditChange}
      />
      <TextField
        margin="dense"
        label="DNI"
        name="dni"
        fullWidth
        value={editData?.dni || ""}
        onChange={handleEditChange}
      />
      <TextField
        margin="dense"
        label="Teléfono"
        name="telefono"
        fullWidth
        value={editData?.telefono || ""}
        onChange={handleEditChange}
      />
      <TextField
        margin="dense"
        label="Observaciones"
        name="observaciones"
        fullWidth
        value={editData?.observaciones || ""}
        onChange={handleEditChange}
      />
      <TextField
        margin="dense"
        label="Límite de crédito"
        name="limiteCredito"
        fullWidth
        value={editData?.limiteCredito || ""}
        onChange={handleEditChange}
      />
      <TextField
        margin="dense"
        label="Saldo"
        name="saldo"
        fullWidth
        value={editData?.saldo || ""}
        onChange={handleEditChange}
      />
      <TextField
        select
        margin="dense"
        label="Tipo de cliente"
        name="tipoCliente"
        fullWidth
        value={editData?.tipoCliente || ""}
        onChange={handleEditChange}
      >
        <MenuItem value="OCASIONAL">Ocasional</MenuItem>
        <MenuItem value="FRECUENTE">Frecuente</MenuItem>
        <MenuItem value="EMPRESA">Empresa</MenuItem>
      </TextField>
    </>
  );

  const empleadoFields = (
    <>
      <TextField
        margin="dense"
        label="Nombre"
        name="nombre"
        fullWidth
        value={editData?.nombre || ""}
        onChange={handleEditChange}
      />
      <TextField
        margin="dense"
        label="Apellido"
        name="apellido"
        fullWidth
        value={editData?.apellido || ""}
        onChange={handleEditChange}
      />
      <TextField
        margin="dense"
        label="DNI"
        name="dni"
        fullWidth
        value={editData?.dni || ""}
        onChange={handleEditChange}
      />
      <TextField
        margin="dense"
        label="Teléfono"
        name="telefono"
        fullWidth
        value={editData?.telefono || ""}
        onChange={handleEditChange}
      />
      <TextField
        margin="dense"
        label="Legajo"
        name="legajo"
        fullWidth
        value={editData?.legajo || ""}
        onChange={handleEditChange}
      />
      <TextField
        margin="dense"
        label="Sueldo"
        name="sueldo"
        fullWidth
        value={editData?.sueldo || ""}
        onChange={handleEditChange}
      />
      <TextField
        select
        margin="dense"
        label="Especialidad"
        name="especialidad"
        fullWidth
        value={editData?.especialidad || ""}
        onChange={handleEditChange}
      >
        <MenuItem value="RECTIFICADOR">Rectificador</MenuItem>
        <MenuItem value="MANTENIMIENTO">Mantenimiento</MenuItem>
        <MenuItem value="SOLDADOR">Soldador</MenuItem>
        <MenuItem value="CONTADOR">Contador</MenuItem>
        <MenuItem value="ADMINISTRATIVO">Administrativo</MenuItem>
      </TextField>
    </>
  );

  return (
    <Container sx={{ mt: 4 }}>
      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: 3,
          border: "1px solid rgba(30,58,138,0.12)",
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(244,246,251,0.95) 100%)",
          boxShadow: "0 18px 40px rgba(15,23,42,0.08)",
        }}
      >
        <Typography
          variant="h5"
          align="center"
          gutterBottom
          sx={{ fontWeight: 700 }}
        >
          Gestión de Personas
        </Typography>

        <Stack
          direction="row"
          spacing={2}
          justifyContent="flex-end"
          sx={{ mb: 2 }}
        >
          <Button
            variant="contained"
            onClick={() => {
              setAddType(null);
              setAddOpen(true);
            }}
          >
            Agregar persona
          </Button>
        </Stack>

        <Tabs
          value={tabValue}
          onChange={(e, newValue) => setTabValue(newValue)}
          centered
          sx={{ mb: 3 }}
        >
          <Tab label="Clientes" />
          <Tab label="Empleados" />
        </Tabs>

        <Divider sx={{ mb: 2 }} />
      <Box>
        {/* Tabla de CLIENTES */}
        {tabValue === 0 && (
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "rgba(30,58,138,0.08)" }}>
                <TableCell>
                  <b>ID</b>
                </TableCell>
                <TableCell>
                  <b>Nombre</b>
                </TableCell>
                <TableCell>
                  <b>Apellido</b>
                </TableCell>
                <TableCell>
                  <b>DNI</b>
                </TableCell>
                <TableCell>
                  <b>Tipo de Cliente</b>
                </TableCell>
                <TableCell>
                  <b>Acciones</b>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {clientes.map((c) => (
                <TableRow key={c.id} hover>
                  <TableCell>{c.id}</TableCell>
                  <TableCell>{c.nombre}</TableCell>
                  <TableCell>{c.apellido}</TableCell>
                  <TableCell>{c.dni}</TableCell>
                  <TableCell>{c.tipoCliente}</TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1}>
                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        startIcon={<EditIcon />}
                        onClick={() => handleEdit("cliente", c)}
                      >
                        Editar
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        size="small"
                        startIcon={<DeleteIcon />}
                        onClick={() => openDeleteDialog("cliente", c)}
                      >
                        Eliminar
                      </Button>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        {/* Tabla de EMPLEADOS */}
        {tabValue === 1 && (
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "rgba(30,58,138,0.08)" }}>
                <TableCell>
                  <b>ID</b>
                </TableCell>
                <TableCell>
                  <b>Nombre</b>
                </TableCell>
                <TableCell>
                  <b>Apellido</b>
                </TableCell>
                <TableCell>
                  <b>DNI</b>
                </TableCell>
                <TableCell>
                  <b>Especialidad</b>
                </TableCell>
                <TableCell>
                  <b>Sueldo</b>
                </TableCell>
                <TableCell>
                  <b>Acciones</b>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {empleados.map((e) => (
                <TableRow key={e.id} hover>
                  <TableCell>{e.id}</TableCell>
                  <TableCell>{e.nombre}</TableCell>
                  <TableCell>{e.apellido}</TableCell>
                  <TableCell>{e.dni}</TableCell>
                  <TableCell>{e.especialidad}</TableCell>
                  <TableCell>${e.sueldo}</TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1}>
                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        startIcon={<EditIcon />}
                        onClick={() => handleEdit("empleado", e)}
                      >
                        Editar
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        size="small"
                        startIcon={<DeleteIcon />}
                        onClick={() => openDeleteDialog("empleado", e)}
                      >
                        Eliminar
                      </Button>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Box>
      </Paper>

      <Dialog
        open={addOpen}
        onClose={() => {
          setAddOpen(false);
          setAddType(null);
        }}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>Agregar persona</DialogTitle>
        <DialogContent dividers>
          {!addType ? (
            <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
              <Button
                variant="contained"
                onClick={() => setAddType("cliente")}
              >
                Cliente
              </Button>
              <Button
                variant="outlined"
                onClick={() => setAddType("empleado")}
              >
                Empleado
              </Button>
            </Stack>
          ) : (
            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
              Alta de {addType === "cliente" ? "cliente" : "empleado"}
            </Typography>
          )}

          {addType === "cliente" && (
            <FormCliente
              onSaved={() => {
                setAddOpen(false);
                setAddType(null);
                cargarDatos();
              }}
            />
          )}
          {addType === "empleado" && (
            <FormEmpleado
              onSaved={() => {
                setAddOpen(false);
                setAddType(null);
                cargarDatos();
              }}
            />
          )}
          {!addType && (
            <Typography variant="body2" color="text.secondary">
              Selecciona si deseas agregar un cliente o un empleado.
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setAddOpen(false);
              setAddType(null);
            }}
          >
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={editOpen} onClose={handleEditClose} fullWidth maxWidth="sm">
        <DialogTitle>
          Editar {editType === "cliente" ? "cliente" : "empleado"}
        </DialogTitle>
        <DialogContent dividers>
          {editType === "cliente" ? clienteFields : empleadoFields}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditClose}>Cancelar</Button>
          <Button variant="contained" onClick={handleEditSave}>
            Guardar
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={deleteDialog.open}
        onClose={closeDeleteDialog}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle>Confirmar eliminación</DialogTitle>
        <DialogContent dividers>
          <DialogContentText>
            {`¿Eliminar este ${deleteDialog.tipo === "cliente" ? "cliente" : "empleado"}?`}
          </DialogContentText>
          <Typography variant="subtitle1" sx={{ mt: 1 }}>
            {deleteDialog.item
              ? `${deleteDialog.item.nombre || ""} ${deleteDialog.item.apellido || ""}`.trim()
              : ""}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteDialog}>Cancelar</Button>
          <Button color="error" variant="contained" onClick={handleConfirmDelete}>
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default PersonasTabs;
