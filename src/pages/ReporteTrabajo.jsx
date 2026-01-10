import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PrintIcon from "@mui/icons-material/Print";
import { actualizarCostoManoDeObra, obtenerReporteTrabajo } from "../services/api";

const ReporteTrabajo = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [reporte, setReporte] = useState(null);
  const [error, setError] = useState("");
  const [printOpen, setPrintOpen] = useState(false);
  const [costoManoDeObraDraft, setCostoManoDeObraDraft] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const cargarReporte = async () => {
      try {
        const data = await obtenerReporteTrabajo(id);
        setReporte(data);
        setCostoManoDeObraDraft(
          data?.costoManoDeObra != null ? String(data.costoManoDeObra) : ""
        );
      } catch (err) {
        console.error("Error obteniendo reporte", err);
        setError("No se pudo cargar el informe del trabajo.");
      }
    };
    cargarReporte();
  }, [id]);

  const articulos = useMemo(() => reporte?.articulos || [], [reporte]);
  const total = reporte?.totalArticulos ?? 0;

  const formatoMoneda = (value) => {
    if (value == null || value === "") return "-";
    const numero = Number(value);
    if (Number.isNaN(numero)) return "-";
    return `$${numero.toFixed(2)}`;
  };

  const handleAbrirImprimir = () => {
    setCostoManoDeObraDraft(
      reporte?.costoManoDeObra != null ? String(reporte.costoManoDeObra) : ""
    );
    setPrintOpen(true);
  };

  const handleCerrarImprimir = () => {
    if (saving) return;
    setPrintOpen(false);
  };

  const exportarPdf = (data) => {
    const filasArticulos = (data.articulos || [])
      .map(
        (articulo) => `
        <tr>
          <td>${articulo.titulo || "-"}</td>
          <td>${articulo.codigoDeProducto || "-"}</td>
          <td>${formatoMoneda(articulo.precioUnitario)}</td>
          <td>${articulo.cantidad ?? 0}</td>
          <td>${formatoMoneda(articulo.subtotal)}</td>
        </tr>
      `
      )
      .join("");

    const contenido = `
      <html>
        <head>
          <title>Reporte trabajo ${data.codigoPublico ?? ""}</title>
          <style>
            body { font-family: Arial, sans-serif; color: #111827; margin: 24px; }
            h1 { font-size: 20px; margin-bottom: 12px; }
            table { width: 100%; border-collapse: collapse; margin-top: 16px; }
            th, td { border: 1px solid #e5e7eb; padding: 8px; font-size: 12px; }
            th { background: #f3f4f6; text-align: left; }
            .info { margin-bottom: 12px; font-size: 13px; }
            .info div { margin: 4px 0; }
            .total { text-align: right; margin-top: 12px; font-weight: 700; }
          </style>
        </head>
        <body>
          <h1>Informe de trabajo</h1>
          <div class="info">
            <div><b>Nro de trabajo:</b> ${data.codigoPublico ?? "-"}</div>
            <div><b>Tipo de trabajo:</b> ${data.tipoTrabajo || "-"}</div>
            <div><b>Responsable:</b> ${data.responsable || "-"}</div>
            <div><b>Cliente:</b> ${data.cliente || "-"}</div>
            <div><b>Diagnóstico:</b> ${data.diagnostico || "-"}</div>
            <div><b>Tareas realizadas:</b> ${data.tareasRealizar || "-"}</div>
            <div><b>Costo mano de obra:</b> ${formatoMoneda(data.costoManoDeObra)}</div>
            <div><b>Trabajo anterior:</b> ${data.trabajoAnteriorCodigoPublico ?? "-"}</div>
          </div>
          <table>
            <thead>
              <tr>
                <th>Articulo</th>
                <th>Código</th>
                <th>Precio unitario</th>
                <th>Cantidad</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              ${filasArticulos || "<tr><td colspan='5'>No hay articulos registrados.</td></tr>"}
            </tbody>
          </table>
          <div class="total">Total articulos: ${formatoMoneda(data.totalArticulos)}</div>
        </body>
      </html>
    `;

    const ventana = window.open("", "_blank");
    if (!ventana) return;
    ventana.document.open();
    ventana.document.write(contenido);
    ventana.document.close();

    const imprimir = () => {
      try {
        ventana.focus();
        ventana.print();
      } catch (err) {
        console.error("Error al imprimir", err);
      }
    };

    ventana.onload = () => {
      setTimeout(imprimir, 250);
    };
  };

  const handleConfirmarImprimir = async () => {
    setSaving(true);
    const nuevoCosto =
      costoManoDeObraDraft === "" ? null : Number(costoManoDeObraDraft);
    if (costoManoDeObraDraft !== "" && Number.isNaN(nuevoCosto)) {
      setSaving(false);
      alert("Ingresa un costo de mano de obra válido.");
      return;
    }
    try {
      const costoActual =
        reporte?.costoManoDeObra != null ? Number(reporte.costoManoDeObra) : null;
      if (reporte && nuevoCosto !== costoActual) {
        await actualizarCostoManoDeObra(reporte.trabajoId, nuevoCosto);
        setReporte((prev) =>
          prev ? { ...prev, costoManoDeObra: nuevoCosto } : prev
        );
      }
      exportarPdf({ ...reporte, costoManoDeObra: nuevoCosto });
      setPrintOpen(false);
    } catch (err) {
      console.error("Error actualizando costo mano de obra", err);
      alert("No se pudo actualizar el costo de mano de obra.");
    } finally {
      setSaving(false);
    }
  };

  if (error) {
    return (
      <Container sx={{ py: 4 }}>
        <Paper sx={{ p: 3, borderRadius: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Informe de trabajo
          </Typography>
          <Typography color="error">{error}</Typography>
          <Button
            startIcon={<ArrowBackIcon />}
            sx={{ mt: 2 }}
            onClick={() => navigate("/trabajos")}
          >
            Volver
          </Button>
        </Paper>
      </Container>
    );
  }

  if (!reporte) {
    return (
      <Container sx={{ py: 4 }}>
        <Typography>Cargando informe...</Typography>
      </Container>
    );
  }

  return (
    <Container sx={{ py: 3 }}>
      <Stack spacing={2}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate("/trabajos")}
          >
            Volver
          </Button>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            Informe de trabajo
          </Typography>
        </Stack>

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
          <Stack spacing={1.2} sx={{ mb: 2 }}>
            <Typography variant="subtitle1">
              <b>Nro de trabajo:</b> {reporte.codigoPublico ?? "-"}
            </Typography>
            <Typography variant="subtitle1">
              <b>Responsable:</b> {reporte.responsable || "-"}
            </Typography>
            <Typography variant="subtitle1">
              <b>Cliente:</b> {reporte.cliente || "-"}
            </Typography>
            <Typography variant="subtitle1">
              <b>Tipo de trabajo:</b> {reporte.tipoTrabajo || "-"}
            </Typography>
            <Typography variant="subtitle1">
              <b>Diagnóstico:</b> {reporte.diagnostico || "-"}
            </Typography>
            <Typography variant="subtitle1">
              <b>Tareas realizadas:</b> {reporte.tareasRealizar || "-"}
            </Typography>
            <Typography variant="subtitle1">
              <b>Costo mano de obra:</b> {formatoMoneda(reporte.costoManoDeObra)}
            </Typography>
            <Typography variant="subtitle1">
              <b>Trabajo anterior:</b> {reporte.trabajoAnteriorCodigoPublico ?? "-"}
            </Typography>
          </Stack>

          <Box sx={{ mt: 2 }}>
            <Typography variant="h6" sx={{ mb: 1 }}>
              Articulos utilizados
            </Typography>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ backgroundColor: "rgba(30,58,138,0.08)" }}>
                  <TableCell><b>Articulo</b></TableCell>
                  <TableCell><b>Codigo</b></TableCell>
                  <TableCell><b>Precio unitario</b></TableCell>
                  <TableCell><b>Cantidad</b></TableCell>
                  <TableCell><b>Subtotal</b></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {articulos.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5}>No hay articulos registrados.</TableCell>
                  </TableRow>
                )}
                {articulos.map((articulo) => (
                  <TableRow key={articulo.articuloId || articulo.codigoDeProducto}>
                    <TableCell>{articulo.titulo || "-"}</TableCell>
                    <TableCell>{articulo.codigoDeProducto || "-"}</TableCell>
                    <TableCell>
                      {articulo.precioUnitario != null
                        ? `$${Number(articulo.precioUnitario).toFixed(2)}`
                        : "-"}
                    </TableCell>
                    <TableCell>{articulo.cantidad ?? 0}</TableCell>
                    <TableCell>
                      {articulo.subtotal != null
                        ? `$${Number(articulo.subtotal).toFixed(2)}`
                        : "-"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <Stack direction="row" justifyContent="flex-end" sx={{ mt: 2 }}>
              <Typography variant="h6">
                Total articulos: {formatoMoneda(total)}
              </Typography>
            </Stack>
          </Box>
        </Paper>
        <Stack direction="row" justifyContent="flex-end">
          <Button
            variant="contained"
            startIcon={<PrintIcon />}
            onClick={handleAbrirImprimir}
          >
            Imprimir
          </Button>
        </Stack>
      </Stack>

      <Dialog open={printOpen} onClose={handleCerrarImprimir} fullWidth maxWidth="sm">
        <DialogTitle>Imprimir informe</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <Typography variant="subtitle1">
              <b>Tipo de trabajo:</b> {reporte.tipoTrabajo || "-"}
            </Typography>
            <TextField
              label="Costo mano de obra"
              type="number"
              inputProps={{ min: 0, step: "0.01" }}
              value={costoManoDeObraDraft}
              onChange={(e) => setCostoManoDeObraDraft(e.target.value)}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCerrarImprimir} disabled={saving}>
            Cancelar
          </Button>
          <Button variant="contained" onClick={handleConfirmarImprimir} disabled={saving}>
            Aceptar e imprimir
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ReporteTrabajo;
