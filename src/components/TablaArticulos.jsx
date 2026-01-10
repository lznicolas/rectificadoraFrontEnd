import React from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import InventoryIcon  from "@mui/icons-material/Inventory";

const TablaArticulos = ({articulos,onEditar,onEliminar,onActualizarStock})=>{
    return(
        <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 3, border: "1px solid rgba(30,58,138,0.12)" }}>
            <Table>
                <TableHead>
                    <TableRow sx={{ backgroundColor: "rgba(30,58,138,0.08)" }}>
                        <TableCell><strong>Codigo</strong></TableCell>
                        <TableCell><strong>Titulo</strong></TableCell>
                        <TableCell><strong>Descripcion</strong></TableCell>
                        <TableCell><strong>Precio unitario</strong></TableCell>
                        <TableCell><strong>Categoria</strong></TableCell>
                        <TableCell><strong>Ubicacion</strong></TableCell>
                        <TableCell><strong>Acciones</strong></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {articulos.map((articulo)=>(
                        <TableRow key  ={articulo.id} hover>
                            <TableCell>{articulo.codigoDeProducto}</TableCell>
                            <TableCell>{articulo.titulo}</TableCell>
                            <TableCell>{articulo.descripcion}</TableCell>
                            <TableCell>
                                {articulo.precioUnitario != null ? `$ ${Number(articulo.precioUnitario).toFixed(2)}` : "—"}
                            </TableCell>
                            <TableCell>{articulo.categoria || "—"}</TableCell>
                            <TableCell>{articulo.ubicacion}</TableCell>
                            <TableCell>
                                <IconButton color="primary" onClick={()=>onEditar(articulo)}>
                                    <EditIcon/>
                                </IconButton>
                                <IconButton color="error" onClick={()=> onEliminar(articulo)}>
                                    <DeleteIcon/>
                                </IconButton>
                                <Button variant="outlined" color="secondary" size="small" onClick={()=> onActualizarStock(articulo)}>
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

export default TablaArticulos;
