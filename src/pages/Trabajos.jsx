import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
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
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Chip,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import DescriptionIcon from "@mui/icons-material/Description";
import {
  obtenerTrabajos,
  crearTrabajo,
  actualizarTrabajo,
  eliminarTrabajo,
  obtenerClientes,
  obtenerEmpleados,
  obtenerArticulos,
  obtenerTrabajosPorCliente,
} from "../services/api";

const tipoOptions = [
  { value: "RECTIFICACION", label: "Rectificación" },
  { value: "CAMBIO_REPUESTO", label: "Cambio de articulo" },
  { value: "MANTENIMIENTO", label: "Mantenimiento" },
];

const estadoOptions = [
  { value: "PENDIENTE", label: "Pendiente" },
  { value: "EN_PROGRESO", label: "En progreso" },
  { value: "TERMINADO", label: "Terminado" },
];

const Trabajos = () => {
  const navigate = useNavigate();
  const [trabajos, setTrabajos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const [articulos, setArticulos] = useState([]);
  const [trabajosCliente, setTrabajosCliente] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [statusFilter, setStatusFilter] = useState("TODOS");
  const [searchTerm, setSearchTerm] = useState("");
  const [form, setForm] = useState({
    codigoPublico: null,
    tipoTrabajo: "",
    estado: "PENDIENTE",
    diagnostico: "",
    tareasRealizar: "",
    detalles: "",
    costoManoDeObra: "",
    clienteId: "",
    empleadoId: "",
    articulos: [],
    trabajoAnteriorId: null,
  });
  const [articuloDraft, setArticuloDraft] = useState({
    articuloId: "",
    cantidadUsada: "",
  });
  const [relacionModalOpen, setRelacionModalOpen] = useState(false);

  const cargarDatos = async () => {
    try {
      const [trabajosRes, clientesRes, empleadosRes, articulosRes] = await Promise.all([
        obtenerTrabajos(),
        obtenerClientes(),
        obtenerEmpleados(),
        obtenerArticulos(),
      ]);
      setTrabajos(trabajosRes || []);
      setClientes(clientesRes || []);
      setEmpleados(empleadosRes || []);
      setArticulos(articulosRes || []);
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
        codigoPublico: trabajo.codigoPublico || null,
        tipoTrabajo: trabajo.tipoTrabajo || "",
        estado: trabajo.estado || "PENDIENTE",
        diagnostico: trabajo.diagnostico || "",
        tareasRealizar: trabajo.tareasRealizar || "",
        detalles: trabajo.detalles || "",
        costoManoDeObra: trabajo.costoManoDeObra ?? "",
        clienteId: trabajo.clientes?.[0]?.clienteId || "",
        empleadoId: trabajo.empleados?.[0]?.empleadoId || "",
        trabajoAnteriorId: trabajo.trabajoAnteriorId || null,
        articulos:
          trabajo.articulos?.map((a) => ({
            articuloId: a.articuloId || a.id,
            cantidadUsada: a.cantidadUsada || "",
          })) || [],
      });
    } else {
      setEditingId(null);
      setForm({
        codigoPublico: null,
        tipoTrabajo: "",
        estado: "PENDIENTE",
        diagnostico: "",
        tareasRealizar: "",
        detalles: "",
        costoManoDeObra: "",
        clienteId: "",
        empleadoId: "",
        articulos: [],
        trabajoAnteriorId: null,
      });
    }
    setArticuloDraft({ articuloId: "", cantidadUsada: "" });
    setTrabajosCliente([]);
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

  const handleArticuloDraftChange = (e) => {
    const { name, value } = e.target;
    setArticuloDraft((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddArticulo = () => {
    if (!articuloDraft.articuloId || !articuloDraft.cantidadUsada) return;
    setForm((prev) => {
      const cantidad = Number(articuloDraft.cantidadUsada);
      const idx = prev.articulos.findIndex(
        (a) => String(a.articuloId) === String(articuloDraft.articuloId)
      );
      if (idx >= 0) {
        const nuevos = [...prev.articulos];
        const actual = nuevos[idx];
        nuevos[idx] = {
          ...actual,
          cantidadUsada: Number(actual.cantidadUsada || 0) + cantidad,
        };
        return { ...prev, articulos: nuevos };
      }
      return {
        ...prev,
        articulos: [
          ...prev.articulos,
          { articuloId: articuloDraft.articuloId, cantidadUsada: cantidad },
        ],
      };
    });
    setArticuloDraft({ articuloId: "", cantidadUsada: "" });
  };

  const handleRemoveArticulo = (index) => {
    setForm((prev) => ({
      ...prev,
      articulos: prev.articulos.filter((_, i) => i !== index),
    }));
  };

  const cargarTrabajosCliente = async () => {
    if (!form.clienteId) return;
    try {
      const data = await obtenerTrabajosPorCliente(form.clienteId);
      const terminados = Array.isArray(data)
        ? data.filter((t) => t.estado === "TERMINADO")
        : [];
      setTrabajosCliente(terminados);
      setRelacionModalOpen(true);
    } catch (err) {
      console.error("Error obteniendo trabajos del cliente", err);
      alert("No se pudieron cargar los trabajos del cliente.");
    }
  };

  const seleccionarTrabajoAnterior = (trabajo) => {
    setForm((prev) => ({
      ...prev,
      trabajoAnteriorId: trabajo?.id || null,
    }));
    setRelacionModalOpen(false);
  };

  const limpiarTrabajoAnterior = () => {
    setForm((prev) => ({ ...prev, trabajoAnteriorId: null }));
  };

  const handleSave = async () => {
    if (!form.tipoTrabajo) {
      alert("Selecciona el tipo de trabajo.");
      return;
    }
    if (!form.clienteId) {
      alert("Selecciona un cliente para el trabajo.");
      return;
    }
    if (!form.empleadoId) {
      alert("Selecciona un responsable/empleado para el trabajo.");
      return;
    }
    const payload = {
      tipoTrabajo: form.tipoTrabajo,
      estado: form.estado,
      diagnostico: form.diagnostico,
      tareasRealizar: form.tareasRealizar,
      detalles: form.detalles,
      costoManoDeObra: form.costoManoDeObra === "" ? null : form.costoManoDeObra,
      empleados: form.empleadoId ? [{ empleadoId: form.empleadoId }] : [],
      clientes: form.clienteId ? [{ clienteId: form.clienteId }] : [],
      articulos: form.articulos || [],
      trabajoAnteriorId: form.trabajoAnteriorId,
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
  const articulosById = useMemo(() => {
    const lista = Array.isArray(articulos) ? articulos : [];
    return lista.reduce((acc, r) => {
      acc[r.id] = r;
      return acc;
    }, {});
  }, [articulos]);

  const trabajosFiltrados = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return trabajos.filter((t) => {
      const estadoOk =
        statusFilter === "TODOS" ||
        (t.estado || "").toUpperCase() === statusFilter;

      if (!estadoOk) return false;

      if (!term) return true;

      const clienteId = t.clientes?.[0]?.clienteId;
      const empleadoId = t.empleados?.[0]?.empleadoId;
      const clienteNombre = clienteId
        ? `${clientesById[clienteId]?.nombre || ""} ${clientesById[clienteId]?.apellido || ""}`
        : "";
      const empleadoNombre = empleadoId
        ? `${empleadosById[empleadoId]?.nombre || ""} ${empleadosById[empleadoId]?.apellido || ""}`
        : "";

      const nro = t.codigoPublico ? String(t.codigoPublico) : "";
      return (
        nro.toLowerCase().includes(term) ||
        clienteNombre.toLowerCase().includes(term) ||
        empleadoNombre.toLowerCase().includes(term)
      );
    });
  }, [trabajos, statusFilter, searchTerm, clientesById, empleadosById]);

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

        <Stack spacing={2} sx={{ mb: 2 }}>
          <Tabs
            value={statusFilter}
            onChange={(_, value) => setStatusFilter(value)}
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab label="Todos" value="TODOS" />
            <Tab label="Pendientes" value="PENDIENTE" />
            <Tab label="En progreso" value="EN_PROGRESO" />
            <Tab label="Finalizados" value="TERMINADO" />
          </Tabs>
          <TextField
            placeholder="Buscar por nro, cliente o responsable"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            size="small"
            fullWidth
          />
        </Stack>

        <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 3, border: "1px solid rgba(30,58,138,0.12)" }}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "rgba(30,58,138,0.08)" }}>
                <TableCell><b>Nro</b></TableCell>
                <TableCell><b>Tipo</b></TableCell>
                <TableCell><b>Estado</b></TableCell>
                <TableCell><b>Cliente</b></TableCell>
                <TableCell><b>Responsable</b></TableCell>
                <TableCell><b>Diagnóstico</b></TableCell>
                <TableCell><b>Articulos</b></TableCell>
                <TableCell><b>Acciones</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {trabajosFiltrados.map((t) => {
                const clienteId = t.clientes?.[0]?.clienteId;
                const empleadoId = t.empleados?.[0]?.empleadoId;
                const clienteNombre = clienteId
                  ? `${clientesById[clienteId]?.nombre || ""} ${clientesById[clienteId]?.apellido || ""}`
                  : "-";
                const empleadoNombre = empleadoId
                  ? `${empleadosById[empleadoId]?.nombre || ""} ${empleadosById[empleadoId]?.apellido || ""}`
                  : "-";
                const articuloResumen =
                  t.articulos && Array.isArray(t.articulos) && t.articulos.length
                    ? t.articulos
                        .map((r) => {
                          const rep = articulosById[r.articuloId];
                          const nombre = rep?.titulo || rep?.codigoDeProducto || "Articulo";
                          const precio = rep?.precioUnitario != null ? ` $${Number(rep.precioUnitario).toFixed(2)}` : "";
                          return `${nombre} x${r.cantidadUsada ?? "-"}${precio ? ` (${precio})` : ""}`;
                        })
                        .join(", ")
                    : "-";
                return (
                  <TableRow key={t.id} hover>
                    <TableCell>{t.codigoPublico || "—"}</TableCell>
                    <TableCell>{t.tipoTrabajo}</TableCell>
                    <TableCell>{t.estado || "-"}</TableCell>
                    <TableCell>{clienteNombre}</TableCell>
                    <TableCell>{empleadoNombre}</TableCell>
                    <TableCell>{t.diagnostico}</TableCell>
                    <TableCell sx={{ maxWidth: 200 }}>
                      <Typography variant="body2" noWrap title={articuloResumen}>
                        {articuloResumen}
                      </Typography>
                    </TableCell>
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
                          startIcon={<DescriptionIcon />}
                          onClick={() => navigate(`/trabajos/${t.id}/reporte`)}
                        >
                          Informe
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
            <TextField
              label="Nro público"
              value={
                form.codigoPublico
                  ? form.codigoPublico
                  : "Se asignará automáticamente"
              }
              InputProps={{ readOnly: true }}
            />
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
              <InputLabel>Estado</InputLabel>
              <Select
                name="estado"
                label="Estado"
                value={form.estado}
                onChange={handleChange}
              >
                {estadoOptions.map((opt) => (
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
                disabled={Boolean(editingId)}
              >
                {clientes.map((c) => (
                  <MenuItem key={c.id} value={c.id}>
                    {c.nombre} {c.apellido}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {!editingId && form.clienteId && (
              <Stack direction="row" spacing={1} alignItems="center">
                <Button variant="outlined" onClick={cargarTrabajosCliente}>
                  + Vincular trabajo anterior (estado TERMINADO)
                </Button>
                {form.trabajoAnteriorId && (
                  <Button color="secondary" onClick={limpiarTrabajoAnterior}>
                    Quitar vínculo
                  </Button>
                )}
              </Stack>
            )}
            {form.trabajoAnteriorId && (
              <Typography variant="body2" color="text.secondary">
                Trabajo anterior seleccionado: {form.trabajoAnteriorId}
              </Typography>
            )}
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
            <TextField
              name="costoManoDeObra"
              label="Costo mano de obra"
              type="number"
              inputProps={{ min: 0, step: "0.01" }}
              value={form.costoManoDeObra}
              onChange={handleChange}
            />
            <Typography variant="subtitle2" sx={{ mt: 1 }}>
              Articulos
            </Typography>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <FormControl fullWidth>
                <InputLabel>Articulo</InputLabel>
                <Select
                  label="Articulo"
                  name="articuloId"
                  value={articuloDraft.articuloId}
                  onChange={handleArticuloDraftChange}
                >
                  {(Array.isArray(articulos) ? articulos : []).map((r) => (
                    <MenuItem key={r.id} value={r.id}>
                      {r.titulo} ({r.codigoDeProducto || "s/c"}) {r.precioUnitario != null ? `- $${Number(r.precioUnitario).toFixed(2)}` : ""}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                label="Cantidad"
                name="cantidadUsada"
                value={articuloDraft.cantidadUsada}
                onChange={handleArticuloDraftChange}
                type="number"
                inputProps={{ min: 1 }}
                sx={{ minWidth: 140 }}
              />
              <Button variant="outlined" onClick={handleAddArticulo}>
                Agregar articulo
              </Button>
            </Stack>
            <Stack direction="row" spacing={1} flexWrap="wrap">
              {(form.articulos || []).map((r, idx) => {
                const rep = articulosById[r.articuloId];
                const precio = rep?.precioUnitario != null ? ` - $${Number(rep.precioUnitario).toFixed(2)}` : "";
                const label = `${rep?.titulo || "Articulo"} x${r.cantidadUsada}${precio}`;
                return (
                  <Chip
                    key={`${r.articuloId}-${idx}`}
                    label={label}
                    onDelete={() => handleRemoveArticulo(idx)}
                    deleteIcon={<CloseIcon />}
                    sx={{ mb: 1 }}
                  />
                );
              })}
              {(!form.articulos || form.articulos.length === 0) && (
                <Typography variant="body2" color="text.secondary">
                  No hay articulos cargados.
                </Typography>
              )}
            </Stack>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button variant="contained" onClick={handleSave}>
            Guardar
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={relacionModalOpen}
        onClose={() => setRelacionModalOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Seleccionar trabajo anterior (TERMINADO)</DialogTitle>
        <DialogContent dividers>
          {trabajosCliente.length === 0 ? (
            <Typography variant="body2">
              No hay trabajos TERMINADO para este cliente.
            </Typography>
          ) : (
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Nro</TableCell>
                  <TableCell>Diagnóstico</TableCell>
                  <TableCell>Estado</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {trabajosCliente.map((t) => (
                  <TableRow key={t.id} hover>
                    <TableCell>{t.codigoPublico || t.id}</TableCell>
                    <TableCell>{t.diagnostico || "-"}</TableCell>
                    <TableCell>{t.estado}</TableCell>
                    <TableCell>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => seleccionarTrabajoAnterior(t)}
                      >
                        Vincular
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRelacionModalOpen(false)}>Cerrar</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Trabajos;
