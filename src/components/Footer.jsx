import React from "react";
import { Box, Typography } from "@mui/material";

const Footer = () => {
  return (
    <Box
      sx={{
        textAlign: "center",
        padding: 3,
        background:
          "linear-gradient(90deg, rgba(30,58,138,0.9) 0%, rgba(59,130,246,0.85) 100%)",
        color: "white",
        marginTop: "20px",
      }}
    >
      <Typography variant="body2" sx={{ letterSpacing: "0.2px" }}>
        nlamas@nlamas.com
      </Typography>
    </Box>
  );
};

export default Footer;
