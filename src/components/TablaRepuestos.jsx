import React from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import InventoryIcon  from "@mui/icons-material/Inventory";

const TablaRepuestos = ({repuestos,onEditar,onEliminar,onVerStock})=>{
    return(
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell><strong>Codigo</strong></TableCell>
                        <TableCell><strong>Titulo</strong></TableCell>
                        <TableCell><strong>Descipcion</strong></TableCell>
                        <TableCell><strong>Ubicacion</strong></TableCell>
                        <TableCell><strong>Acciones</strong></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {repuestos.map((repuesto)=>(
                        <TableRow key  ={repuesto.id}>
                            <TableCell>{repuesto.codigoDeProducto}</TableCell>
                            <TableCell>{repuesto.titulo}</TableCell>
                            <TableCell>{repuesto.descipcion}</TableCell>
                            <TableCell>{repuesto.ubicacion}</TableCell>
                            <TableCell>
                                <IconButton color="primary" onClick={()=>onEditar(repuesto.id)}>
                                    <EditIcon/>
                                </IconButton>
                                <IconButton color="error" onClick={()=> onEliminar(repuesto.id)}>
                                    <DeleteIcon/>
                                </IconButton>
                                <Button variable="contained" color="secondary" size="small" onClick={()=> onVerStock(repuesto.codigoDeProducto)}>
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