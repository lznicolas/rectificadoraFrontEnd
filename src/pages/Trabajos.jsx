import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  obtenerTrabajos,
  crearTrabajo,
  actualizarTrabajo,
  eliminarTrabajo,
  obtenerClientes,
  obtenerEmpleados,
} from "../services/api";

const tipoOptions = [
  { value: "RECTIFICAION", label: "Rectificación" },
  { value: "CAMBIO_REPUESTO", label: "Cambio de repuesto" },
  { value: "MANTENIMIENTO", label: "Mantenimiento" },
];

const Trabajos = () => {
  const [trabajos, setTrabajos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    tipoTrabajo: "",
    diagnostico: "",
    tareasRealizar: "",
    detalles: "",
    clienteId: "",
    empleadoId: "",
  });

  const cargarDatos = async () => {
    try {
      const [trabajosRes, clientesRes, empleadosRes] = await Promise.all([
        obtenerTrabajos(),
        obtenerClientes(),
        obtenerEmpleados(),
      ]);
      setTrabajos(trabajosRes || []);
      setClientes(clientesRes || []);
      setEmpleados(empleadosRes || []);
    } catch (err) {
      console.error("Error cargando datos de trabajos:", err);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const handleOpen = (trabajo) => {
    if (trabajo) {
      setEditingId(trabajo.id);
      setForm({
        tipoTrabajo: trabajo.tipoTrabajo || "",
        diagnostico: trabajo.diagnostico || "",
        tareasRealizar: trabajo.tareasRealizar || "",
        detalles: trabajo.detalles || "",
        clienteId: trabajo.clientes?.[0]?.clienteId || "",
        empleadoId: trabajo.empleados?.[0]?.empleadoId || "",
      });
    } else {
      setEditingId(null);
      setForm({
        tipoTrabajo: "",
        diagnostico: "",
        tareasRealizar: "",
        detalles: "",
        clienteId: "",
        empleadoId: "",
      });
    }
    setModalOpen(true);
  };

  const handleClose = () => {
    setModalOpen(false);
    setEditingId(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    const payload = {
      tipoTrabajo: form.tipoTrabajo,
      diagnostico: form.diagnostico,
      tareasRealizar: form.tareasRealizar,
      detalles: form.detalles,
      empleados: form.empleadoId ? [{ empleadoId: form.empleadoId }] : [],
      clientes: form.clienteId ? [{ clienteId: form.clienteId }] : [],
      repuestos: [],
    };
    try {
      if (editingId) {
        await actualizarTrabajo(editingId, payload);
      } else {
        await crearTrabajo(payload);
      }
      await cargarDatos();
      handleClose();
    } catch (err) {
      console.error("Error guardando trabajo:", err);
      alert("Error al guardar el trabajo");
    }
  };

  const handleDelete = async (id) => {
    const confirmar = window.confirm("¿Eliminar este trabajo?");
    if (!confirmar) return;
    try {
      await eliminarTrabajo(id);
      setTrabajos((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      console.error("Error eliminando trabajo:", err);
      alert("Error al eliminar el trabajo");
    }
  };

  const clientesById = useMemo(
    () =>
      clientes.reduce((acc, c) => {
        acc[c.id] = c;
        return acc;
      }, {}),
    [clientes]
  );
  const empleadosById = useMemo(
    () =>
      empleados.reduce((acc, e) => {
        acc[e.id] = e;
        return acc;
      }, {}),
    [empleados]
  );

  return (
    <Container sx={{ py: 2 }}>
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
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", sm: "center" }}
          sx={{ mb: 2 }}
        >
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              Trabajos
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Asigna cliente y responsable para cada trabajo.
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpen(null)}
          >
            Nuevo trabajo
          </Button>
        </Stack>

        <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 3, border: "1px solid rgba(30,58,138,0.12)" }}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "rgba(30,58,138,0.08)" }}>
                <TableCell><b>ID</b></TableCell>
                <TableCell><b>Tipo</b></TableCell>
                <TableCell><b>Cliente</b></TableCell>
                <TableCell><b>Responsable</b></TableCell>
                <TableCell><b>Diagnóstico</b></TableCell>
                <TableCell><b>Acciones</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {trabajos.map((t) => {
                const clienteId = t.clientes?.[0]?.clienteId;
                const empleadoId = t.empleados?.[0]?.empleadoId;
                const clienteNombre = clienteId
                  ? `${clientesById[clienteId]?.nombre || ""} ${clientesById[clienteId]?.apellido || ""}`
                  : "-";
                const empleadoNombre = empleadoId
                  ? `${empleadosById[empleadoId]?.nombre || ""} ${empleadosById[empleadoId]?.apellido || ""}`
                  : "-";
                return (
                  <TableRow key={t.id} hover>
                    <TableCell>{t.id}</TableCell>
                    <TableCell>{t.tipoTrabajo}</TableCell>
                    <TableCell>{clienteNombre}</TableCell>
                    <TableCell>{empleadoNombre}</TableCell>
                    <TableCell>{t.diagnostico}</TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1}>
                        <Button
                          variant="outlined"
                          startIcon={<EditIcon />}
                          onClick={() => handleOpen(t)}
                        >
                          Editar
                        </Button>
                        <Button
                          variant="outlined"
                          color="error"
                          startIcon={<DeleteIcon />}
                          onClick={() => handleDelete(t.id)}
                        >
                          Eliminar
                        </Button>
                      </Stack>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Dialog open={modalOpen} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>
          {editingId ? "Editar trabajo" : "Nuevo trabajo"}
        </DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <FormControl fullWidth>
              <InputLabel>Tipo de trabajo</InputLabel>
              <Select
                name="tipoTrabajo"
                label="Tipo de trabajo"
                value={form.tipoTrabajo}
                onChange={handleChange}
              >
                {tipoOptions.map((opt) => (
                  <MenuItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Cliente</InputLabel>
              <Select
                name="clienteId"
                label="Cliente"
                value={form.clienteId}
                onChange={handleChange}
              >
                {clientes.map((c) => (
                  <MenuItem key={c.id} value={c.id}>
                    {c.nombre} {c.apellido}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Responsable</InputLabel>
              <Select
                name="empleadoId"
                label="Responsable"
                value={form.empleadoId}
                onChange={handleChange}
              >
                {empleados.map((e) => (
                  <MenuItem key={e.id} value={e.id}>
                    {e.nombre} {e.apellido}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              name="diagnostico"
              label="Diagnóstico"
              multiline
              minRows={2}
              value={form.diagnostico}
              onChange={handleChange}
            />
            <TextField
              name="tareasRealizar"
              label="Tareas a realizar"
              multiline
              minRows={2}
              value={form.tareasRealizar}
              onChange={handleChange}
            />
            <TextField
              name="detalles"
              label="Detalles"
              multiline
              minRows={2}
              value={form.detalles}
              onChange={handleChange}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button variant="contained" onClick={handleSave}>
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Trabajos;
