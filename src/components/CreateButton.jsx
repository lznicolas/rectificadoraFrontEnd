//Sin funcionalidad - Se debe refactorizar

import React from "react";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
function CreateButton({ onClick }) {
  return (
    <Button
      variant="contained"
      color="primary"
      endIcon={<AddIcon />}
      onClick={onClick}
      sx={{ minWidth: 160, boxShadow: "0 10px 30px rgba(30,58,138,0.25)" }}
    >
      Nuevo producto
    </Button>
  );
}

export default CreateButton;
