import React, { useEffect, useState } from "react";
import {
  Tabs,
  Tab,
  Box,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Stack,
  Container,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";

const PersonasTabs = () => {
  const [tabValue, setTabValue] = useState(0);
  const [clientes, setClientes] = useState([]);
  const [empleados, setEmpleados] = useState([]);

  // Cargar datos al iniciar
  useEffect(() => {
    const fetchData = async () => {
      try {
        const clientesRes = await axios.get(
          "http://localhost:8080/api/clientes/all"
        );
        const empleadosRes = await axios.get(
          "http://localhost:8080/api/empleados/all"
        );
        setClientes(clientesRes.data);
        setEmpleados(empleadosRes.data);
      } catch (error) {
        console.error("Error cargando datos:", error);
      }
    };
    fetchData();
  }, []);

  const handleDelete = async (tipo, id) => {
    try {
      const url =
        tipo === "cliente"
          ? `http://localhost:8080/api/clientes/${id}`
          : `http://localhost:8080/api/empleado/${id}`;
      await axios.delete(url);
      alert(`${tipo} eliminado correctamente`);
      window.location.reload();
    } catch (error) {
      console.error(`Error eliminando ${tipo}:`, error);
      alert(`Error eliminando ${tipo}`);
    }
  };

  const handleEdit = (tipo, id) => {
    alert(`Función editar ${tipo} con ID: ${id} — (en construcción 😎)`);
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Gestión de Personas
      </Typography>

      <Tabs
        value={tabValue}
        onChange={(e, newValue) => setTabValue(newValue)}
        centered
        sx={{ mb: 3 }}
      >
        <Tab label="Clientes" />
        <Tab label="Empleados" />
      </Tabs>

      <Box>
        {/* Tabla de CLIENTES */}
        {tabValue === 0 && (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <b>ID</b>
                </TableCell>
                <TableCell>
                  <b>Nombre</b>
                </TableCell>
                <TableCell>
                  <b>Apellido</b>
                </TableCell>
                <TableCell>
                  <b>DNI</b>
                </TableCell>
                <TableCell>
                  <b>Tipo de Cliente</b>
                </TableCell>
                <TableCell>
                  <b>Acciones</b>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {clientes.map((c) => (
                <TableRow key={c.id}>
                  <TableCell>{c.id}</TableCell>
                  <TableCell>{c.nombre}</TableCell>
                  <TableCell>{c.apellido}</TableCell>
                  <TableCell>{c.dni}</TableCell>
                  <TableCell>{c.tipoCliente}</TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1}>
                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        startIcon={<EditIcon />}
                        onClick={() => handleEdit("cliente", c.id)}
                      >
                        Editar
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        size="small"
                        startIcon={<DeleteIcon />}
                        onClick={() => handleDelete("cliente", c.id)}
                      >
                        Eliminar
                      </Button>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        {/* Tabla de EMPLEADOS */}
        {tabValue === 1 && (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <b>ID</b>
                </TableCell>
                <TableCell>
                  <b>Nombre</b>
                </TableCell>
                <TableCell>
                  <b>Apellido</b>
                </TableCell>
                <TableCell>
                  <b>DNI</b>
                </TableCell>
                <TableCell>
                  <b>Especialidad</b>
                </TableCell>
                <TableCell>
                  <b>Sueldo</b>
                </TableCell>
                <TableCell>
                  <b>Acciones</b>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {empleados.map((e) => (
                <TableRow key={e.id}>
                  <TableCell>{e.id}</TableCell>
                  <TableCell>{e.nombre}</TableCell>
                  <TableCell>{e.apellido}</TableCell>
                  <TableCell>{e.dni}</TableCell>
                  <TableCell>{e.especialidad}</TableCell>
                  <TableCell>${e.sueldo}</TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1}>
                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        startIcon={<EditIcon />}
                        onClick={() => handleEdit("empleado", e.id)}
                      >
                        Editar
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        size="small"
                        startIcon={<DeleteIcon />}
                        onClick={() => handleDelete("empleado", e.id)}
                      >
                        Eliminar
                      </Button>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Box>
    </Container>
  );
};

export default PersonasTabs;
