//Sin funcionalidad - Se debe refactorizar

import React from "react";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
function CreateButton({ onClick }) {
  return (
    <Button variant="contained" endIcon={<AddIcon />} onClick={onClick}>
      Producto
    </Button>
  );
}

export default CreateButton;
