import api from '../lib/api';

export const getAiConfigs = async () => {
  const { data } = await api.get('/aiconfig');
  return data;
};

export const createAiConfig = async (config) => {
  const { data } = await api.post('/aiconfig', config);
  return data;
};

export const updateAiConfig = async (id, config) => {
  const { data } = await api.put(`/aiconfig/${id}`, config);
  return data;
};

export const deleteAiConfig = async (id) => {
  const { data } = await api.delete(`/aiconfig/${id}`);
  return data;
};

export const hasAiConfig = async () => {
  const { data } = await api.get('/aiconfig/tem-configuracao');
  return data.hasConfig;
};
