import api from '../lib/api';

export const getTransactions = async () => {
  const response = await api.get('/Transactions');
  return response.data;
};

export const getTransaction = async (id) => {
  const response = await api.get(`/Transactions/${id}`);
  return response.data;
};

export const createTransaction = async (transaction) => {
  const response = await api.post('/Transactions', transaction);
  return response.data;
};

export const updateTransaction = async (id, transaction) => {
  const response = await api.put(`/Transactions/${id}`, transaction);
  return response.data;
};

export const deleteTransaction = async (id) => {
  const response = await api.delete(`/Transactions/${id}`);
  return response.data;
};

export const getAccounts = async () => {
  const response = await api.get('/Accounts');
  return response.data;
};

export const createAccount = async (account) => {
  const response = await api.post('/Accounts', account);
  return response.data;
};

export const getCategories = async () => {
  const response = await api.get('/Categories');
  return response.data;
};

export const createCategory = async (category) => {
  const response = await api.post('/Categories', category);
  return response.data;
};

export const getTransactionTypes = async () => {
  const response = await api.get('/TransactionTypes');
  return response.data;
};

export const createTransactionType = async (transactionType) => {
  const response = await api.post('/TransactionTypes', transactionType);
  return response.data;
};

export const createMonthlybudgets = async (Budgets) => {
  const response = await api.post('/Monthlybudgets', Budgets);
  return response.data;
};
