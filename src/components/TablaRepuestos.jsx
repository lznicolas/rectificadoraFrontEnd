import React from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import InventoryIcon  from "@mui/icons-material/Inventory";

const TablaRepuestos = ({repuestos,onEditar,onEliminar,onActualizarStock})=>{
    return(
        <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 3, border: "1px solid rgba(30,58,138,0.12)" }}>
            <Table>
                <TableHead>
                    <TableRow sx={{ backgroundColor: "rgba(30,58,138,0.08)" }}>
                        <TableCell><strong>Codigo</strong></TableCell>
                        <TableCell><strong>Titulo</strong></TableCell>
                        <TableCell><strong>Descripcion</strong></TableCell>
                        <TableCell><strong>Ubicacion</strong></TableCell>
                        <TableCell><strong>Acciones</strong></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {repuestos.map((repuesto)=>(
                        <TableRow key  ={repuesto.id} hover>
                            <TableCell>{repuesto.codigoDeProducto}</TableCell>
                            <TableCell>{repuesto.titulo}</TableCell>
                            <TableCell>{repuesto.descripcion}</TableCell>
                            <TableCell>{repuesto.ubicacion}</TableCell>
                            <TableCell>
                                <IconButton color="primary" onClick={()=>onEditar(repuesto)}>
                                    <EditIcon/>
                                </IconButton>
                                <IconButton color="error" onClick={()=> onEliminar(repuesto)}>
                                    <DeleteIcon/>
                                </IconButton>
                                <Button variant="outlined" color="secondary" size="small" onClick={()=> onActualizarStock(repuesto)}>
                                    <InventoryIcon/> Ver Stock
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default TablaRepuestos;
