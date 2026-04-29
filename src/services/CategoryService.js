import axios from 'axios';

const BASE_URL = 'http://localhost:5221/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

export const listarCategorias = async () => {
  const response = await api.get('/Categories');
  return response.data;
};

export const buscarCategoriaPorId = async (id) => {
  const response = await api.get(`/Categories/${id}`);
  return response.data;
};

export const criarCategoria = async (categoria) => {
  const response = await api.post('/Categories', categoria);
  return response.data;
};

export const atualizarCategoria = async (id, categoria) => {
  const response = await api.put(`/Categories/${id}`, categoria);
  return response.data;
};

export const deletarCategoria = async (id) => {
  const response = await api.delete(`/Categories/${id}`);
  return response.data;
};