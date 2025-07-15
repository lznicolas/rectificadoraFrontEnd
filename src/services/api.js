import axios from "axios";

const API_URL = "http://localhost:8080/api/repuestos"; 

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
export const actualizarRepuesto = async(id,repuesto) =>{
  try{
    const response = await axios.put(`${API_URL}/${id}`,repuesto);
    return response.data;
  }catch(error){
    console.error("Error actulizando repuesto", error);
    throw error;
  }

};

//Funcion para Actualizar el Stock
export const actualizarStock = async (codigo,nuevaCantidad)=>{
  try{
    const response = await axios.put(`${API_URL}/codigo/${codigo}/stock`,{
      cantidad : nuevaCantidad,
    });
    return response.data;
  }catch (error){
    console.error("Error al actulizar Stock",error);
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

export async function agregarRepuesto(repuesto) {
  try{
    console.log("Enviando repuesto",repuesto)
    const response = await axios.post(`${API_URL}`,repuesto);
    return response.data;
  }catch(error){
    console.error('Error en agregar Repuesto',error);
    throw error;
  }
  
}
//Elimina un Repuesto
export async function eliminarRepuesto(id) {
  try{
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
  }catch (error){
    console.error("Error eliminando Repuesto", error);
    throw error;
  }

}

//Agrega empleado
export async function agregaEmpleado(id){
  try {
    const response = await axios.post(`${API_URL}/${id}`);
    return response.data;
  }catch(error){
    console.error ("Error al intentar agregar un empleado",error);
    throw error;
  }
}