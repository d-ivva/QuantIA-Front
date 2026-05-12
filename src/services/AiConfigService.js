import axios from 'axios';

const BASE_URL = 'http://localhost:5221/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

export const getAiConfigs = async () => {
  const { data } = await api.get('/aiconfig');
  return data;
};

export const createAiConfig = async (config) => {
  const { data } = await api.post('/aiconfig', config);
  return data;
};

export const updateAiConfig = async (id, config) => {
  await api.put(`/aiconfig/${id}`, config);
};

export const deleteAiConfig = async (id) => {
  await api.delete(`/aiconfig/${id}`);
};

export const hasAiConfig = async () => {
  const { data } = await api.get('/aiconfig/tem-configuracao');
  return data.hasConfig;
};
