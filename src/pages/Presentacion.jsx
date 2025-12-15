import React from "react";
import {
  Box,
  Container,
  Grid,
  Paper,
  Stack,
  Typography,
  Chip,
} from "@mui/material";
import BuildIcon from "@mui/icons-material/Build";
import SecurityIcon from "@mui/icons-material/Security";
import HandshakeIcon from "@mui/icons-material/Handshake";

const cards = [
  {
    title: "¿Quiénes somos?",
    body: "Taller especializado en la rectificación de motores y mantenimiento integral. Combinamos experiencia, ingeniería y equipos de última generación para entregar motores listos para trabajar.",
    icon: <BuildIcon color="primary" />,
  },
  {
    title: "Nuestros valores",
    body: "Compromiso con el cliente, transparencia en cada reparación, responsabilidad técnica y un trato humano que construye relaciones de confianza.",
    icon: <HandshakeIcon color="primary" />,
  },
  {
    title: "Contactanos",
    body: "Av. Principal 123, Tucumán, Argentina · (381) 555-1234 · rectificadora.pepe@mail.com",
    icon: <SecurityIcon color="primary" />,
  },
];

const Presentacion = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 2, width: "100%" }}>
      <Box
        sx={{
          backgroundColor: "rgba(255,255,255,0.85)",
          borderRadius: 3,
          p: { xs: 3, md: 4 },
          boxShadow: "0 20px 60px rgba(17,24,39,0.12)",
          border: "1px solid rgba(30,58,138,0.08)",
        }}
      >
        <Stack spacing={1} sx={{ mb: 4 }}>
          <Chip
            label="Rectificadora Moyano"
            color="primary"
            sx={{ alignSelf: "flex-start", fontWeight: 600 }}
          />
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Motores precisos, reparaciones limpias
          </Typography>
          <Typography variant="body1" sx={{ color: "text.secondary" }}>
            Acompañamos a talleres, flotas y particulares con diagnósticos
            claros, repuestos controlados y seguimiento de cada trabajo.
          </Typography>
        </Stack>

        <Grid container spacing={3}>
          {cards.map((card) => (
            <Grid item xs={12} md={4} key={card.title}>
              <Paper
                elevation={0}
                sx={{
                  height: "100%",
                  p: 3,
                  borderRadius: 3,
                  border: "1px solid rgba(226,232,240,0.8)",
                  background:
                    "linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(244,246,251,0.95) 100%)",
                  boxShadow: "0 12px 30px rgba(15,23,42,0.08)",
                  display: "flex",
                  flexDirection: "column",
                  gap: 1.5,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                  {card.icon}
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    {card.title}
                  </Typography>
                </Box>
                <Typography sx={{ color: "text.secondary", lineHeight: 1.6 }}>
                  {card.body}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
};

export default Presentacion;
