import React, { useState } from "react";
import {
  Box,
  TextField,
  Typography,
  Grid,
  Card,
  CardContent,
  Divider,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { agregarCliente } from "../services/api";

const tipoClienteOptions = ["OCASIONAL", "FRECUENTE", "EMPRESA"];
const provinciasArgentina = [
  "Buenos Aires",
  "CABA",
  "Catamarca",
  "Chaco",
  "Chubut",
  "Córdoba",
  "Corrientes",
  "Entre Ríos",
  "Formosa",
  "Jujuy",
  "La Pampa",
  "La Rioja",
  "Mendoza",
  "Misiones",
  "Neuquén",
  "Río Negro",
  "Salta",
  "San Juan",
  "San Luis",
  "Santa Cruz",
  "Santa Fe",
  "Santiago del Estero",
  "Tierra del Fuego",
  "Tucumán",
];

const FormCliente = ({ onSaved }) => {
  const [cuilPrefix, setCuilPrefix] = useState("");
  const [cuilSuffix, setCuilSuffix] = useState("");
  const [fieldErrors, setFieldErrors] = useState({
    nombre: "",
    apellido: "",
    dni: "",
    telefono: "",
  });
  const [missingFields, setMissingFields] = useState([]);
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [formData, setFormData] = useState({
    apellido: "",
    nombre: "",
    dni: "",
    cuil: "",
    telefono: "",
    direccion: {
      calle: "",
      numero: "",
      codigoPostal: "",
      piso: "",
      dpto: "",
      localidad: "",
      pais: "Argentina",
      provincia: "",
    },
    tipoCliente: "",
    observaciones: "",
    limiteCredito: "",
    saldo: "",
  });

  const sanitizeLetters = (text) =>
    text.replace(/[^a-zA-ZÁÉÍÓÚáéíóúñÑüÜ\s]/g, "");
  const sanitizeNumbers = (text) => text.replace(/[^0-9]/g, "");
  const normalizeDni = (value) => {
    const clean = sanitizeNumbers(value);
    if (!clean) return "";
    if (clean.length > 8) return clean;
    return clean.padStart(8, "0");
  };

  const composeCuil = (prefix, dniValue, suffix) => {
    const cleanDni = sanitizeNumbers(dniValue);
    if (!cleanDni) return "";
    if (prefix.length !== 2 || suffix.length !== 1) return "";
    return `${prefix}-${cleanDni}-${suffix}`;
  };

  const formatCuilDisplay = (prefix, dniValue, suffix) => {
    const cleanDni = sanitizeNumbers(dniValue);
    const pre = (prefix || "").padEnd(2, "_");
    const dniPart = cleanDni.padEnd(8, "_");
    const suf = suffix || "_";
    return `${pre}-${dniPart}-${suf}`;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    if (name === "apellido" || name === "nombre") {
      const sanitized = sanitizeLetters(value);
      const hasInvalid = value !== sanitized;
      setFormData((prev) => ({
        ...prev,
        [name]: sanitized,
      }));
      setFieldErrors((prev) => ({
        ...prev,
        [name]: hasInvalid ? `El ${name} no puede contener numeros.` : "",
      }));
      return;
    }

    if (name === "dni") {
      const cleanDni = sanitizeNumbers(value);
      const hasInvalid = value !== cleanDni;
      const tooLong = cleanDni.length > 8;
      setFormData((prev) => ({
        ...prev,
        dni: cleanDni,
        cuil: composeCuil(cuilPrefix, cleanDni, cuilSuffix),
      }));
      setFieldErrors((prev) => ({
        ...prev,
        dni: tooLong
          ? "El dni no puede ser mayor a 8 digitos"
          : hasInvalid
          ? "El dni solo puede tener numeros"
          : "",
      }));
      return;
    }

    if (["telefono", "limiteCredito", "saldo"].includes(name)) {
      if (name === "telefono") {
        const cleanPhone = sanitizeNumbers(value);
        const hasInvalid = value !== cleanPhone;
        setFormData((prev) => ({
          ...prev,
          [name]: cleanPhone,
        }));
        setFieldErrors((prev) => ({
          ...prev,
          telefono: hasInvalid ? "El telefono solo puede tener numeros." : "",
        }));
        return;
      }
      setFormData((prev) => ({
        ...prev,
        [name]: sanitizeNumbers(value),
      }));
      return;
    }

    if (name === "tipoCliente") {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
      return;
    }

    if (name === "observaciones") {
      setFormData((prev) => ({
        ...prev,
        observaciones: value,
      }));
      return;
    }

    if (["pais", "provincia"].includes(name)) {
      setFormData((prev) => ({
        ...prev,
        direccion: {
          ...prev.direccion,
          [name]: value,
        },
      }));
      return;
    }

    // Campos de dirección
    setFormData((prev) => ({
      ...prev,
      direccion: {
        ...prev.direccion,
        [name]: ["numero", "codigoPostal"].includes(name)
          ? sanitizeNumbers(value)
          : value,
      },
    }));
  };

  const handleDniBlur = () => {
    const normalized = normalizeDni(formData.dni);
    if (!normalized || normalized === formData.dni) return;
    setFormData((prev) => ({
      ...prev,
      dni: normalized,
      cuil: composeCuil(cuilPrefix, normalized, cuilSuffix),
    }));
  };

  const handleCuilChange = (event) => {
    const digits = sanitizeNumbers(event.target.value);
    const dniValue = formData.dni;
    const digitsWithoutDni = dniValue ? digits.replace(dniValue, "") : digits;
    const verifierDigits = digitsWithoutDni.slice(0, 3);
    const prefix = verifierDigits.slice(0, 2);
    const suffix = verifierDigits.slice(2, 3);
    setCuilPrefix(prefix);
    setCuilSuffix(suffix);
    setFormData((prev) => ({
      ...prev,
      cuil: composeCuil(prefix, prev.dni, suffix),
    }));
  };

  const handleGuardarCliente = async () => {
    setSubmitAttempted(true);
    const required = ["apellido", "nombre", "dni", "tipoCliente"];
    const missing = required.filter((field) => !formData[field]);
    setMissingFields(missing);
    if (missing.length > 0) {
      return;
    }
    if (fieldErrors.nombre || fieldErrors.apellido || fieldErrors.dni || fieldErrors.telefono) {
      return;
    }
    if (formData.dni && formData.dni.length > 8) {
      return;
    }
    const normalizedDni = normalizeDni(formData.dni);
    try {
      await agregarCliente({ ...formData, dni: normalizedDni });
      alert("Cliente creado correctamente ✅");
      if (onSaved) {
        onSaved();
      }
      setFormData({
        apellido: "",
        nombre: "",
        dni: "",
        cuil: "",
        telefono: "",
        direccion: {
          calle: "",
          numero: "",
          codigoPostal: "",
          piso: "",
          dpto: "",
          localidad: "",
          pais: "Argentina",
          provincia: "",
        },
        tipoCliente: "",
        observaciones: "",
        limiteCredito: "",
        saldo: "",
      });
      setCuilPrefix("");
      setCuilSuffix("");
      setFieldErrors({ nombre: "", apellido: "", dni: "", telefono: "" });
      setMissingFields([]);
      setSubmitAttempted(false);
    } catch (error) {
      console.error("Error al guardar Cliente:", error);
      alert("❌ Error al crear el Cliente");
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        p: 4,
        gap: 3,
      }}
    >
      {/* --- DATOS PERSONALES --- */}
      <Card
        sx={{
          width: "100%",
          maxWidth: 900,
          borderRadius: 3,
          boxShadow: "0 12px 30px rgba(15,23,42,0.08)",
          border: "1px solid rgba(30,58,138,0.12)",
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.96) 0%, rgba(244,246,251,0.96) 100%)",
        }}
      >
        <CardContent>
          <Typography variant="h6" sx={{ mb: 1, fontWeight: "bold" }}>
            Datos Personales
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Apellido *"
                name="apellido"
                value={formData.apellido}
                onChange={handleChange}
                error={Boolean(fieldErrors.apellido) || (submitAttempted && !formData.apellido)}
                helperText={
                  submitAttempted && !formData.apellido
                    ? "Apellido obligatorio."
                    : fieldErrors.apellido
                }
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Nombre *"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                error={Boolean(fieldErrors.nombre) || (submitAttempted && !formData.nombre)}
                helperText={
                  submitAttempted && !formData.nombre
                    ? "Nombre obligatorio."
                    : fieldErrors.nombre
                }
                required
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="DNI *"
                name="dni"
                value={formData.dni}
                onChange={handleChange}
                onBlur={handleDniBlur}
                error={Boolean(fieldErrors.dni) || (submitAttempted && !formData.dni)}
                helperText={
                  submitAttempted && !formData.dni
                    ? "DNI obligatorio."
                    : fieldErrors.dni
                }
                required
                inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="CUIL/CUIT"
                name="cuil"
                value={formatCuilDisplay(cuilPrefix, formData.dni, cuilSuffix)}
                onChange={handleCuilChange}
                inputProps={{ inputMode: "numeric" }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Teléfono"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                error={Boolean(fieldErrors.telefono)}
                helperText={fieldErrors.telefono}
                inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* --- DIRECCIÓN --- */}
      <Card
        sx={{
          width: "100%",
          maxWidth: 900,
          borderRadius: 3,
          boxShadow: "0 12px 30px rgba(15,23,42,0.08)",
          border: "1px solid rgba(30,58,138,0.12)",
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.96) 0%, rgba(244,246,251,0.96) 100%)",
        }}
      >
        <CardContent>
          <Typography variant="h6" sx={{ mb: 1, fontWeight: "bold" }}>
            Dirección
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
              <InputLabel>Pais</InputLabel>
              <Select
                label="Pais"
                name="pais"
                value={formData.direccion.pais}
                onChange={handleChange}
              >
                <MenuItem value="Argentina">Argentina</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Provincia</InputLabel>
              <Select
                label="Provincia"
                name="provincia"
                value={formData.direccion.provincia}
                onChange={handleChange}
              >
                {provinciasArgentina.map((provincia) => (
                  <MenuItem key={provincia} value={provincia}>
                    {provincia}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={8}>
            <TextField
              fullWidth
              label="Calle"
              name="calle"
              value={formData.direccion.calle}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Número"
              name="numero"
              value={formData.direccion.numero}
              onChange={handleChange}
              inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Código Postal"
              name="codigoPostal"
              value={formData.direccion.codigoPostal}
              onChange={handleChange}
              inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Departamento"
              name="dpto"
              value={formData.direccion.dpto}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Piso"
              name="piso"
              value={formData.direccion.piso}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Localidad"
              name="localidad"
              value={formData.direccion.localidad}
              onChange={handleChange}
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>

      {/* --- DATOS DEL CLIENTE --- */}
      <Card
        sx={{
          width: "100%",
          maxWidth: 900,
          borderRadius: 3,
          boxShadow: "0 12px 30px rgba(15,23,42,0.08)",
          border: "1px solid rgba(30,58,138,0.12)",
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.96) 0%, rgba(244,246,251,0.96) 100%)",
        }}
      >
        <CardContent>
          <Typography variant="h6" sx={{ mb: 1, fontWeight: "bold" }}>
            Datos del Cliente
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel error={submitAttempted && !formData.tipoCliente}>Tipo de Cliente *</InputLabel>
              <Select
                label="Tipo de Cliente *"
                name="tipoCliente"
                value={formData.tipoCliente}
                onChange={handleChange}
                error={submitAttempted && !formData.tipoCliente}
                required
              >
                <MenuItem value="" disabled>
                  Seleccione
                </MenuItem>
                {tipoClienteOptions.map((tipo) => (
                  <MenuItem key={tipo} value={tipo}>
                    {tipo}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Observaciones"
              name="observaciones"
              value={formData.observaciones}
              onChange={handleChange}
              multiline
              minRows={3}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Limite de Credito"
              name="limiteCredito"
              value={formData.limiteCredito}
              onChange={handleChange}
              inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Saldo"
                name="saldo"
                value={formData.saldo}
                onChange={handleChange}
                inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {submitAttempted && missingFields.length > 0 && (
        <Typography color="error" variant="body2">
          Campos vacios:{" "}
          {missingFields
            .map((field) => {
              const labels = {
                apellido: "Apellido",
                nombre: "Nombre",
                dni: "DNI",
                tipoCliente: "Tipo de cliente",
              };
              return labels[field] || field;
            })
            .join(", ")}
          .
        </Typography>
      )}

      <Button
        variant="contained"
        color="primary"
        sx={{ mt: 2, width: "200px" }}
        onClick={handleGuardarCliente}
      >
        Guardar Cliente
      </Button>
    </Box>
  );
};

export default FormCliente;
