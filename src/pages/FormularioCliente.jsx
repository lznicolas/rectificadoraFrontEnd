import React from "react";
import { Container } from "@mui/material";
import FormCliente from "../components/FormCliente";

const FormularioCliente = () => {
  return (
    <Container
      sx={{
        marginTop: "20px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <FormCliente />
    </Container>
  );
};

export default FormularioCliente;
