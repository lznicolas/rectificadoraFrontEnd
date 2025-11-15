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
import { agregarCliente } from "../services/api";

const FormCliente = () => {
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
    tipocliente: "",
    observaciones: "",
    limitedecredito: "",
    saldo: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;

    // Campos principales (persona + cliente)
    if (
      ["apellido", "nombre", "dni", "cuil", "telefono", "tipocliente"].includes(
        name
      )
    ) {
      setFormData({
        ...formData,
        [name]: ["dni", "telefono", "limitedecredito", "saldo"].includes(name)
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

  const handleGuardarCliente = async () => {
    try {
      await agregarCliente(formData);
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
        tipocliente: "",
        observaciones: "",
        limitedecredito: "",
        saldo: "",
      });
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

      {/* --- DATOS DEL CLIENTE --- */}
      <Card
        sx={{ width: "100%", maxWidth: 900, borderRadius: 3, boxShadow: 3 }}
      >
        <CardContent>
          <Typography variant="h6" sx={{ mb: 1, fontWeight: "bold" }}>
            Datos del Cliente
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Tipo de Cliente"
                name="tipocliente"
                value={formData.tipocliente}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Observaciones"
                name="observaciones"
                value={formData.observaciones}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Limite de Credito"
                name="limitedecredito"
                value={formData.limitedecredito}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Saldo"
                name="saldo"
                value={formData.saldo}
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
        onClick={handleGuardarCliente}
      >
        Guardar Cliente
      </Button>
    </Box>
  );
};

export default FormCliente;
