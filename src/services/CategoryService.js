import api from '../lib/api';

export const getCategories = async () => {
  const response = await api.get('/Categories');
  return response.data;
};

export const getCategory = async (id) => {
  const response = await api.get(`/Categories/${id}`);
  return response.data;
};

export const createCategory = async (category) => {
  const response = await api.post('/Categories', category);
  return response.data;
};

export const updateCategory = async (id, category) => {
  const response = await api.put(`/Categories/${id}`, category);
  return response.data;
};

export const deleteCategory = async (id) => {
  const response = await api.delete(`/Categories/${id}`);
  return response.data;
};
