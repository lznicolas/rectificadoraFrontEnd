import axios from "axios";

const API_URL = "http://localhost:8080/api/repuestos";
const API_URLEmpl = "http://localhost:8080/api/empleados";
const API_URLCli = "http://localhost:8080/api/clientes";
const API_URLTrab = "http://localhost:8080/api/trabajos";
const API_URLEspec = `${API_URLEmpl}/especialidades`;
const API_URLLegajoSugerido = `${API_URLEmpl}/legajos/sugerido`;

//Funcion para obtener los repuestos
export const obtenerRepuestos = async () => {
  try {
    const response = await axios.get(`${API_URL}/all`);
    return response.data;
  } catch (error) {
    console.error("Error obteniendo repuestos", error);
    return [];
  }
};

//Actualizar los Repuestos
export const actualizarRepuesto = async (id, repuesto) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, repuesto);
    return response.data;
  } catch (error) {
    console.error("Error actulizando repuesto", error);
    throw error;
  }
};

//Funcion para Actualizar el Stock
export const actualizarStock = async (codigo, nuevaCantidad) => {
  try {
    const response = await axios.put(`${API_URL}/codigo/${codigo}/stock`, {
      cantidad: nuevaCantidad,
    });
    return response.data;
  } catch (error) {
    console.error("Error al actulizar Stock", error);
    throw error;
  }
};

//Obtiene el Stock
export const obtenerStock = async (codigo) => {
  try {
    const response = await axios.get(`${API_URL}/codigo/${codigo}/stock`);
    return response.data;
  } catch (error) {
    console.error("Error obteniendo stock:", error);
    return null;
  }
};

//Agregar Repuesto
export async function agregarRepuesto(repuesto) {
  try {
    console.log("Enviando repuesto", repuesto);
    const response = await axios.post(`${API_URL}`, repuesto);
    return response.data;
  } catch (error) {
    console.error("Error en agregar Repuesto", error);
    throw error;
  }
}
//Elimina un Repuesto
export async function eliminarRepuesto(id) {
  try {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error eliminando Repuesto", error);
    throw error;
  }
}

//Agrega empleado
export const agregarEmpleado = async (empleado) => {
  return axios.post(`${API_URLEmpl}`, empleado);
};

//Agrega Persona
export const agregarCliente = async (empleado) => {
  return axios.post(`${API_URLCli}`, empleado);
};

//Listar
export const obtenerClientes = async () =>
  (await axios.get(`${API_URLCli}/all`)).data;
export const obtenerEmpleados = async () =>
  (await axios.get(`${API_URLEmpl}/all`)).data;

//Actualizar
export const actualizarCliente = async (id, cliente) =>
  (await axios.put(`${API_URLCli}/${id}`, cliente)).data;
export const actualizarEmpleado = async (id, empleado) =>
  (await axios.put(`${API_URLEmpl}/${id}`, empleado)).data;

//Eliminar
export const eliminarCliente = async (id) =>
  (await axios.delete(`${API_URLCli}/${id}`)).data;
export const eliminarEmpleado = async (id) =>
  (await axios.delete(`${API_URLEmpl}/${id}`)).data;

// Especialidades (enum) y legajo sugerido
export const obtenerEspecialidades = async () =>
  (await axios.get(API_URLEspec)).data;

export const obtenerLegajoSugerido = async (especialidad) =>
  (
    await axios.get(API_URLLegajoSugerido, {
      params: { especialidad },
    })
  ).data;

//Trabajos
export const obtenerTrabajos = async () =>
  (await axios.get(`${API_URLTrab}/all`)).data;
export const crearTrabajo = async (trabajo) =>
  (await axios.post(`${API_URLTrab}`, trabajo)).data;
export const actualizarTrabajo = async (id, trabajo) =>
  (await axios.put(`${API_URLTrab}/${id}`, trabajo)).data;
export const eliminarTrabajo = async (id) =>
  (await axios.delete(`${API_URLTrab}/${id}`)).data;
