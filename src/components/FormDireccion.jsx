//Sin funcionalidad - Se debe refactorizar

import React, { useState } from "react";
import { Box, TextField, Typography, Grid, Stack, Grid2 } from "@mui/material";
import { Grade } from "@mui/icons-material";

const FormDireccion = () => {
  const [formData, setFormData] = useState({
    calle: "",
    numero: "",
    codigoPostal: "",
    dpto: "",
    piso: "",
    localidad: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;

    if (name === "numero" || name === "codigoPostal") {
      const numericValue = value.replace(/[^0-9]/g, "");
      setFormData({
        ...formData,
        [name]: numericValue,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const fields = [
    { label: "Calle", name: "calle" },
    { label: "Numero", name: "numero", isNumeric: true },
    { label: "Codigo Postal", name: "codigoPostal", isNumeric: true },
    { label: "Departamento", name: "dptop" },
    { label: "Piso", name: "piso" },
    { label: "Localidad", name: "localidad" },
  ];

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "80vh",
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
                value={formData[item.name]}
                onChange={handleChange}
                inputMode={item.isNumeric ? "numeric" : "text"}
              />
            </Stack>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};
export default FormDireccion;
