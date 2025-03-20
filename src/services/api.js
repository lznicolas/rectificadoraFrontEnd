import axios from "axios";

const API_URL = "http://localhost:8080/api/repuestos"; 

export const obtenerRepuestos = async () => {
  try {
    const response = await axios.get(`${API_URL}/all`);
    return response.data;
  } catch (error) {
    console.error("Error obteniendo repuestos", error);
    return [];
  }
};
