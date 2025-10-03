import React, { useState } from "react"; 
import { Box, TextField, Typography, Grid, Stack, Alert, Button } from "@mui/material";
import { agregarPersona } from "../services/api";
const FormPersona = () => {
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
      dptop: "",
      piso: "",
      localidad: ""
    }
  });

  // Guardar nueva persona
  const handleGuardarNuevaPersona = async () => {
    try {
      await agregarPersona(formData);
      alert("Persona creada correctamente!");
    } catch (error) {
      alert("Error al agregar una persona!");
      console.error(error);
    }
  };

  // Manejar cambios
  const handleChange = (event) => {
    const { name, value } = event.target;

    // Campos principales
    if (["apellido", "nombre", "dni", "cuil", "telefono"].includes(name)) {
      setFormData({
        ...formData,
        [name]:
          name === "dni" || name === "cuil" || name === "telefono"
            ? value.replace(/[^0-9]/g, "")
            : value,
      });
    }

    // Campos de dirección
    else {
      setFormData({
        ...formData,
        direccion: {
          ...formData.direccion,
          [name]:
            name === "numero" || name === "codigoPostal"
              ? value.replace(/[^0-9]/g, "")
              : value,
        },
      });
    }
  };

  // Configuración de campos
  const fields = [
    { label: "Apellido", name: "apellido" },
    { label: "Nombre", name: "nombre" },
    { label: "DNI", name: "dni", isNumeric: true },
    { label: "CUIL/CUIT", name: "cuil", isNumeric: true },
    { label: "Teléfono", name: "telefono", isNumeric: true },
    { label: "Calle", name: "calle" },
    { label: "Número", name: "numero", isNumeric: true },
    { label: "Código Postal", name: "codigoPostal", isNumeric: true },
    { label: "Departamento", name: "dptop" },
    { label: "Piso", name: "piso" },
    { label: "Localidad", name: "localidad" },
  ];

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        p: 3,
      }}
    >
      <Grid container spacing={3}>
        {fields.map((item) => (
          <Grid item xs={12} sm={6} key={item.name}>
            <Stack spacing={1}>
              <Typography variant="h6" sx={{ color: "black" }}>
                {item.label}:
              </Typography>
              <TextField
                fullWidth
                label={item.label}
                variant="outlined"
                name={item.name}
                value={
                  formData[item.name] !== undefined
                    ? formData[item.name]
                    : formData.direccion[item.name] || ""
                }
                onChange={handleChange}
                inputMode={item.isNumeric ? "numeric" : "text"}
              />
            </Stack>
          </Grid>
        ))}
      </Grid>
      <Button
        variant="contained"
        sx={{ mt: 3 }}
        onClick={handleGuardarNuevaPersona}
      >
        Guardar Persona
      </Button>
    </Box>
  );
};

export default FormPersona;