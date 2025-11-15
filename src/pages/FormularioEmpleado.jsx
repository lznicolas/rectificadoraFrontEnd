import React from "react";
import { Container } from "@mui/material";
import FormEmpleado from "../components/FormEmpleado";

const FormularioEmpleado = () => {
  return (
    <Container
      sx={{
        marginTop: "20px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <FormEmpleado />
    </Container>
  );
};

export default FormularioEmpleado;
