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
import {
  actualizarCostoManoDeObra,
  obtenerEmpresaConfig,
  obtenerReporteTrabajo,
} from "../services/api";

const ReporteTrabajo = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [reporte, setReporte] = useState(null);
  const [empresaConfig, setEmpresaConfig] = useState(null);
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
    const cargarEmpresa = async () => {
      try {
        const config = await obtenerEmpresaConfig();
        setEmpresaConfig(config);
      } catch (err) {
        console.error("Error obteniendo empresa config", err);
      }
    };
    cargarReporte();
    cargarEmpresa();
  }, [id]);

  const articulos = useMemo(() => reporte?.articulos || [], [reporte]);
  const total = reporte?.totalArticulos ?? 0;
  const costoManoDeObra = reporte?.costoManoDeObra ?? 0;
  const totalConManoDeObra = Number(total || 0) + Number(costoManoDeObra || 0);
  const puedeImprimir = reporte?.estado === "TERMINADO";

  const formatoMoneda = (value) => {
    if (value == null || value === "") return "-";
    const numero = Number(value);
    if (Number.isNaN(numero)) return "-";
    return `$${numero.toFixed(2)}`;
  };

  const handleAbrirImprimir = () => {
    if (!puedeImprimir) {
      alert("Solo se puede imprimir cuando el trabajo está TERMINADO.");
      return;
    }
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
    const empresa = empresaConfig || {};
    const filasArticulos = (data.articulos || [])
      .map(
        (articulo) => `
        <tr>
          <td>${articulo.titulo || "-"}</td>
          <td>${articulo.cantidad ?? 0}</td>
          <td>${formatoMoneda(articulo.precioUnitario)}</td>
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
            body { font-family: Arial, sans-serif; color: #111827; margin: 28px; }
            h1 { font-size: 20px; letter-spacing: 2px; margin: 6px 0 4px; text-align: center; }
            h2 { font-size: 16px; margin: 6px 0; text-align: center; }
            .topline { text-align: center; font-size: 12px; color: #374151; }
            .section { margin-top: 14px; }
            .row { display: flex; justify-content: space-between; gap: 16px; font-size: 12px; }
            .row div { margin: 2px 0; }
            .block { flex: 1; min-width: 0; }
            .label { font-weight: 700; }
            .value { display: inline-block; max-width: 100%; white-space: normal; word-break: break-word; vertical-align: bottom; }
            .align-right { text-align: right; }
            table { width: 100%; border-collapse: collapse; margin-top: 12px; font-size: 12px; }
            th, td { border-bottom: 1px solid #e5e7eb; padding: 6px 4px; text-align: left; }
            th { border-top: 1px solid #e5e7eb; background: #f9fafb; }
            .total-row { display: flex; justify-content: flex-end; gap: 16px; margin-top: 8px; font-size: 12px; }
            .total-strong { font-weight: 700; font-size: 13px; }
            .footer { margin-top: 24px; font-size: 11px; text-align: center; color: #6b7280; }
          </style>
        </head>
        <body>
          <div class="topline">${
            empresa.razonSocial || empresa.nombreFantasia || ""
          }</div>
          <h1>REPORTE</h1>
          <h2>${empresa.nombreFantasia || "-"}</h2>
          <div class="topline">${data.cliente || "-"}</div>

          <div class="section row">
            <div class="block">
              <div><span class="label">Reporte n.°</span> <span class="value">${
                data.codigoPublico ?? "-"
              }</span></div>
              <div><span class="label">Fecha de emisión</span> <span class="value">${new Date().toLocaleDateString()}</span></div>
            </div>
            <div class="block align-right">
              <div><span class="label">Teléfono cliente</span> <span class="value">${
                data.telefonoCliente || "-"
              }</span></div>
              <div><span class="label">Dirección cliente</span> <span class="value">${
                data.direccionCliente || "-"
              }</span></div>
            </div>
          </div>

          <div class="section row">
            <div class="block"><span class="label">Tipo trabajo:</span> <span class="value">${
              data.tipoTrabajo || "-"
            }</span></div>
            <div class="block align-right"><span class="label">Estado:</span> <span class="value">${
              data.estado || "-"
            }</span></div>
            <div class="block align-right"><span class="label">Trabajo anterior:</span> <span class="value">${
              data.trabajoAnteriorCodigoPublico ?? "-"
            }</span></div>
          </div>
          <div class="section row">
            <div class="block"><span class="label">Responsable:</span> <span class="value">${
              data.responsable || "-"
            }</span></div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Artículo</th>
                <th>Cantidad</th>
                <th>Precio</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${
                filasArticulos ||
                "<tr><td colspan='4'>No hay articulos registrados.</td></tr>"
              }
            </tbody>
          </table>

          <div class="total-row">
            <div><b>Mano de obra</b></div>
            <div>${formatoMoneda(data.costoManoDeObra)}</div>
          </div>
          <div class="section">
            <b>Diagnóstico:</b><br/>
            ${data.diagnostico || "-"}
          </div>
          <div class="total-row">
            <div>Subtotal artículos:</div>
            <div>${formatoMoneda(data.totalArticulos)}</div>
          </div>
          <div class="total-row total-strong">
            <div>TOTAL:</div>
            <div>${formatoMoneda(
              Number(data.totalArticulos || 0) +
                Number(data.costoManoDeObra || 0)
            )}</div>
          </div>

          <div class="footer">
            ${empresa.correoElectronico || "-"}${
      empresa.direccion ? ` | ${empresa.direccion}` : ""
    }${empresa.telefono ? ` | ${empresa.telefono}` : ""}
          </div>
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
    if (!puedeImprimir) {
      alert("Solo se puede imprimir cuando el trabajo está FINALIZADO.");
      return;
    }
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
        reporte?.costoManoDeObra != null
          ? Number(reporte.costoManoDeObra)
          : null;
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

  const empresa = empresaConfig || {};

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
          <Stack spacing={1} sx={{ textAlign: "center" }}>
            <Typography variant="caption" color="text.secondary">
              {empresa.razonSocial || empresa.nombreFantasia || "-"}
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 800, letterSpacing: 2 }}>
              REPORTE
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {empresa.nombreFantasia || "-"}
            </Typography>
            <Typography variant="subtitle1">
              {reporte.cliente || "-"}
            </Typography>
          </Stack>

          <Stack
            direction={{ xs: "column", md: "row" }}
            justifyContent="space-between"
            spacing={2}
            sx={{ mt: 3 }}
          >
            <Stack spacing={0.5} sx={{ minWidth: 0 }}>
              <Typography variant="body2" sx={{ wordBreak: "break-word" }}>
                <b>Reporte n.°</b> {reporte.codigoPublico ?? "-"}
              </Typography>
              <Typography variant="body2" sx={{ wordBreak: "break-word" }}>
                <b>Fecha de emisión</b> {new Date().toLocaleDateString()}
              </Typography>
            </Stack>
            <Stack spacing={0.5} sx={{ minWidth: 0, textAlign: "right" }}>
              <Typography variant="body2" sx={{ wordBreak: "break-word" }}>
                <b>Teléfono cliente</b> {reporte.telefonoCliente || "-"}
              </Typography>
              <Typography variant="body2" sx={{ wordBreak: "break-word" }}>
                <b>Dirección cliente</b> {reporte.direccionCliente || "-"}
              </Typography>
            </Stack>
          </Stack>

          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
            spacing={1}
            sx={{ mt: 2 }}
          >
            <Typography variant="body2" sx={{ minWidth: 0, wordBreak: "break-word" }}>
              <b>Tipo trabajo:</b> {reporte.tipoTrabajo || "-"}
            </Typography>
            <Typography
              variant="body2"
              sx={{ minWidth: 0, textAlign: "right", wordBreak: "break-word" }}
            >
              <b>Estado:</b> {reporte.estado || "-"}
            </Typography>
            <Typography
              variant="body2"
              sx={{ minWidth: 0, textAlign: "right", wordBreak: "break-word" }}
            >
              <b>Trabajo anterior:</b>{" "}
              {reporte.trabajoAnteriorCodigoPublico ?? "-"}
            </Typography>
          </Stack>
          <Stack sx={{ mt: 1 }}>
            <Typography variant="body2" sx={{ minWidth: 0, wordBreak: "break-word" }}>
              <b>Responsable:</b> {reporte.responsable || "-"}
            </Typography>
          </Stack>

          <Box sx={{ mt: 2 }}>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ backgroundColor: "rgba(30,58,138,0.08)" }}>
                  <TableCell>
                    <b>Artículo</b>
                  </TableCell>
                  <TableCell>
                    <b>Cantidad</b>
                  </TableCell>
                  <TableCell>
                    <b>Precio</b>
                  </TableCell>
                  <TableCell>
                    <b>Total</b>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {articulos.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4}>
                      No hay articulos registrados.
                    </TableCell>
                  </TableRow>
                )}
                {articulos.map((articulo) => (
                  <TableRow
                    key={articulo.articuloId || articulo.codigoDeProducto}
                  >
                    <TableCell>{articulo.titulo || "-"}</TableCell>
                    <TableCell>{articulo.cantidad ?? 0}</TableCell>
                    <TableCell>
                      {formatoMoneda(articulo.precioUnitario)}
                    </TableCell>
                    <TableCell>{formatoMoneda(articulo.subtotal)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <Stack
              direction="row"
              justifyContent="flex-end"
              sx={{ mt: 2 }}
              spacing={2}
            >
              <Typography variant="body2">
                Mano de obra: {formatoMoneda(reporte.costoManoDeObra)}
              </Typography>
            </Stack>

            <Stack spacing={1} sx={{ mt: 2 }}>
              <Typography variant="body2">
                <b>Diagnóstico:</b> {reporte.diagnostico || "-"}
              </Typography>
              <Typography variant="body2">
                <b>Tareas realizadas:</b> {reporte.tareasRealizar || "-"}
              </Typography>
            </Stack>

            <Stack
              direction="row"
              justifyContent="flex-end"
              sx={{ mt: 2 }}
              spacing={2}
            >
              <Typography variant="body2">
                Subtotal artículos: {formatoMoneda(total)}
              </Typography>
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                TOTAL: {formatoMoneda(totalConManoDeObra)}
              </Typography>
            </Stack>

            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ mt: 3, display: "block", textAlign: "center" }}
            >
              {empresa.correoElectronico || "-"}
              {empresa.direccion ? ` | ${empresa.direccion}` : ""}
              {empresa.telefono ? ` | ${empresa.telefono}` : ""}
            </Typography>
          </Box>
        </Paper>
        <Stack direction="row" justifyContent="flex-end">
          <Button
            variant="contained"
            startIcon={<PrintIcon />}
            onClick={handleAbrirImprimir}
            disabled={!puedeImprimir}
          >
            Imprimir
          </Button>
        </Stack>
        {!puedeImprimir && (
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ textAlign: "right" }}
          >
            Solo se puede imprimir cuando el trabajo está TERMINADO.
          </Typography>
        )}
      </Stack>

      <Dialog
        open={printOpen}
        onClose={handleCerrarImprimir}
        fullWidth
        maxWidth="sm"
      >
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
          <Button
            variant="contained"
            onClick={handleConfirmarImprimir}
            disabled={saving}
          >
            Aceptar e imprimir
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ReporteTrabajo;
