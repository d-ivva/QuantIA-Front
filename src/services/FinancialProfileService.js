import api from '../lib/api';

export const getFinancialProfile = async () => {
  const response = await api.get('/FinancialProfile');
  return response.data;
};

export const createFinancialProfile = async (profile) => {
  const response = await api.post('/FinancialProfile', profile);
  return response.data;
};

export const updateFinancialProfile = async (profile) => {
  const response = await api.put('/FinancialProfile', profile);
  return response.data;
};
