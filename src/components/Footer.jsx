import React from "react";
import { Box, Typography } from "@mui/material";

const Footer = () => {
  return (
    <Box sx={{ textAlign: "center", padding: 2, backgroundColor: "secondary.main", color: "white", marginTop: "20px" }}>
      <Typography variant="body2">nlamas@nlamas.com</Typography>
    </Box>
  );
};

export default Footer;
