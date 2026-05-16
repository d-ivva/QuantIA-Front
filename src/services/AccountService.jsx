import api from '../lib/api';

export const getAccounts = async () => {
  const response = await api.get('/Accounts');
  return response.data;
};

export const getAccount = async (id) => {
  const response = await api.get(`/Accounts/${id}`);
  return response.data;
};

export const createAccount = async (account) => {
  const response = await api.post('/Accounts', account);
  return response.data;
};

export const updateAccount = async (id, account) => {
  const response = await api.put(`/Accounts/${id}`, account);
  return response.data;
};

export const deleteAccount = async (id) => {
  const response = await api.delete(`/Accounts/${id}`);
  return response.data;
};
