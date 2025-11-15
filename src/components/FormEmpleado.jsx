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
} from "@mui/material";
import { agregarEmpleado } from "../services/api";

const FormEmpleado = () => {
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
      dptop: "",
      localidad: "",
    },
    legajo: "",
    sueldo: "",
    especialidad: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;

    // Campos principales (persona + empleado)
    if (
      [
        "apellido",
        "nombre",
        "dni",
        "cuil",
        "telefono",
        "legajo",
        "sueldo",
        "especialidad",
      ].includes(name)
    ) {
      setFormData({
        ...formData,
        [name]: ["dni", "telefono", "sueldo"].includes(name)
          ? value.replace(/[^0-9]/g, "")
          : value,
      });
    } else {
      // Campos de dirección
      setFormData({
        ...formData,
        direccion: {
          ...formData.direccion,
          [name]: ["numero", "codigoPostal"].includes(name)
            ? value.replace(/[^0-9]/g, "")
            : value,
        },
      });
    }
  };

  const handleGuardarEmpleado = async () => {
    try {
      await agregarEmpleado(formData);
      alert("Empleado creado correctamente ✅");
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
          dptop: "",
          localidad: "",
        },
        legajo: "",
        sueldo: "",
        especialidad: "",
      });
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
        sx={{ width: "100%", maxWidth: 900, borderRadius: 3, boxShadow: 3 }}
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
                label="Apellido"
                name="apellido"
                value={formData.apellido}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="DNI"
                name="dni"
                value={formData.dni}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="CUIL/CUIT"
                name="cuil"
                value={formData.cuil}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Teléfono"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* --- DIRECCIÓN --- */}
      <Card
        sx={{ width: "100%", maxWidth: 900, borderRadius: 3, boxShadow: 3 }}
      >
        <CardContent>
          <Typography variant="h6" sx={{ mb: 1, fontWeight: "bold" }}>
            Dirección
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Grid container spacing={2}>
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
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Código Postal"
                name="codigoPostal"
                value={formData.direccion.codigoPostal}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Departamento"
                name="dptop"
                value={formData.direccion.dptop}
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
        sx={{ width: "100%", maxWidth: 900, borderRadius: 3, boxShadow: 3 }}
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
                label="Legajo"
                name="legajo"
                value={formData.legajo}
                onChange={handleChange}
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
              <TextField
                fullWidth
                label="Especialidad"
                name="especialidad"
                value={formData.especialidad}
                onChange={handleChange}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

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
