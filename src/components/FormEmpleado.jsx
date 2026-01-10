import React, { useEffect, useState } from "react";
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
import {
  agregarEmpleado,
  obtenerEspecialidades,
  obtenerLegajoSugerido,
} from "../services/api";

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

const FormEmpleado = ({ onSaved }) => {
  const [cuilPrefix, setCuilPrefix] = useState("");
  const [cuilSuffix, setCuilSuffix] = useState("");
  const [especialidades, setEspecialidades] = useState([]);
  const [fieldErrors, setFieldErrors] = useState({
    nombre: "",
    apellido: "",
    dni: "",
    telefono: "",
    legajo: "",
    especialidad: "",
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
    legajo: "",
    sueldo: "",
    especialidad: "",
  });
  const especialidadesFallback = [
    "RECTIFICADOR",
    "MANTENIMIENTO",
    "SOLDADOR",
    "CONTADOR",
    "ADMINISTRATIVO",
  ];
  const especialidadesDisponibles =
    especialidades && especialidades.length > 0
      ? especialidades
      : especialidadesFallback;
  const minLegajo = formData.especialidad === "ADMINISTRATIVO" ? 100 : 10000;

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

  useEffect(() => {
    const loadEspecialidades = async () => {
      try {
        const data = await obtenerEspecialidades();
        setEspecialidades(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error obteniendo especialidades:", error);
        setEspecialidades([]);
      }
    };
    loadEspecialidades();
  }, []);

  useEffect(() => {
    const fetchLegajoSugerido = async () => {
      if (!formData.especialidad) return;
      try {
        const sugerido = await obtenerLegajoSugerido(formData.especialidad);
        if (sugerido) {
          setFormData((prev) => ({ ...prev, legajo: String(sugerido) }));
        }
      } catch (error) {
        console.error("No se pudo obtener legajo sugerido:", error);
      }
    };
    fetchLegajoSugerido();
  }, [formData.especialidad]);

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

    if (["telefono", "sueldo", "legajo"].includes(name)) {
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

    if (name === "especialidad") {
      setFormData((prev) => ({
        ...prev,
        especialidad: value,
        legajo: "",
      }));
      setFieldErrors((prev) => ({
        ...prev,
        especialidad: value ? "" : "Especialidad obligatoria.",
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

  const handleDniBlur = () => {
    const normalized = normalizeDni(formData.dni);
    if (!normalized || normalized === formData.dni) return;
    setFormData((prev) => ({
      ...prev,
      dni: normalized,
      cuil: composeCuil(cuilPrefix, normalized, cuilSuffix),
    }));
  };

  const handleGuardarEmpleado = async () => {
    setSubmitAttempted(true);
    const required = ["apellido", "nombre", "dni", "especialidad", "legajo"];
    const missing = required.filter((field) => !formData[field]);
    setMissingFields(missing);
    if (missing.length > 0) return;
    if (fieldErrors.nombre || fieldErrors.apellido || fieldErrors.dni || fieldErrors.telefono) return;
    if (formData.dni && formData.dni.length > 8) return;
    const normalizedDni = normalizeDni(formData.dni);
    const legajoNumber = Number(formData.legajo);
    if (!legajoNumber || legajoNumber < minLegajo) {
      setFieldErrors((prev) => ({
        ...prev,
        legajo: `El legajo debe ser mayor o igual a ${minLegajo}.`,
      }));
      alert(
        `El legajo debe ser un número mayor o igual a ${minLegajo} según la especialidad seleccionada.`
      );
      return;
    }
    try {
      await agregarEmpleado({ ...formData, dni: normalizedDni });
      alert("Empleado creado correctamente ✅");
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
        legajo: "",
        sueldo: "",
        especialidad: "",
      });
      setCuilPrefix("");
      setCuilSuffix("");
      setFieldErrors({
        nombre: "",
        apellido: "",
        dni: "",
        telefono: "",
        legajo: "",
        especialidad: "",
      });
      setMissingFields([]);
      setSubmitAttempted(false);
    } catch (error) {
      console.error("Error al guardar empleado:", error);
      alert("❌ Error al crear el empleado");
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

      {/* --- DATOS DEL EMPLEADO --- */}
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
            Datos del Empleado
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Legajo *"
                name="legajo"
                value={formData.legajo}
                onChange={handleChange}
                error={Boolean(fieldErrors.legajo) || (submitAttempted && !formData.legajo)}
                inputProps={{
                  inputMode: "numeric",
                  pattern: "[0-9]*",
                  min: minLegajo,
                }}
                helperText={
                  submitAttempted && !formData.legajo
                    ? "Legajo obligatorio."
                    : fieldErrors.legajo ||
                      `Mínimo ${minLegajo}${
                        formData.especialidad
                          ? ` para ${formData.especialidad.toLowerCase()}`
                          : ""
                      }`
                }
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Sueldo"
                name="sueldo"
                value={formData.sueldo}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel error={submitAttempted && !formData.especialidad}>Especialidad *</InputLabel>
                <Select
                  label="Especialidad *"
                  name="especialidad"
                  value={formData.especialidad}
                  onChange={handleChange}
                  error={submitAttempted && !formData.especialidad}
                >
                  {especialidadesDisponibles.map((esp) => (
                    <MenuItem key={esp} value={esp}>
                      {esp}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
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
                especialidad: "Especialidad",
                legajo: "Legajo",
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
        onClick={handleGuardarEmpleado}
      >
        Guardar Empleado
      </Button>
    </Box>
  );
};

export default FormEmpleado;
