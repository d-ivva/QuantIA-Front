import api from '../lib/api';

export const getMonthlyBudgets = async () => {
  const response = await api.get('/monthlybudgets');
  return response.data;
};

export const getMonthlyBudget = async (id) => {
  const response = await api.get(`/monthlybudgets/${id}`);
  return response.data;
};

export const getMonthlyBudgetByMonthYear = async (month, year) => {
  const response = await api.get(`/monthlybudgets/${month}/${year}`);
  return response.data;
};

export const createMonthlyBudget = async (budget) => {
  const response = await api.post('/monthlybudgets', budget);
  return response.data;
};

export const updateMonthlyBudget = async (id, budget) => {
  const response = await api.put(`/monthlybudgets/${id}`, budget);
  return response.data;
};

export const deleteMonthlyBudget = async (id) => {
  const response = await api.delete(`/monthlybudgets/${id}`);
  return response.data;
};

export const getBudgetReport = async (month, year) => {
  const response = await api.get(`/monthlybudgets/report/${month}/${year}`);
  return response.data;
};
