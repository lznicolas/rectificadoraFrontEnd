import React, { useState } from "react"; 
import { Box, TextField, Typography, Grid, Stack } from "@mui/material";

const FormPersona = () => {
    const [formData, setFormData] = useState({
        apellido: "",
        nombre: "",
        dni: "",
        cuil: "",
        /*direccion: "",*/
        telefono: "",
    });

    const handleChange = (event) => {
        const { name, value } = event.target;

        if (name === "dni" || name === "cuil" || name === "telefono") {
            const numericValue = value.replace(/[^0-9]/g, '');
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
        { label: "Apellido", name: "apellido" },
        { label: "Nombre", name: "nombre" },
        { label: "DNI", name: "dni", isNumeric: true },
        { label: "CUIL/CUIT", name: "cuil", isNumeric: true },
        /*{ label: "Direccion", name: "direccion" },*/
        { label: "Telefono", name: "telefono", isNumeric: true },
    ];

    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "80vh",
                p: 3
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
                                inputMode={item.isNumeric ? 'numeric' : 'text'}
                            />
                        </Stack>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default FormPersona;