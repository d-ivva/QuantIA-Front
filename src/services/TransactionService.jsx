import axios from 'axios';

// Ajuste a porta conforme o terminal do dotnet run
const BASE_URL = 'http://localhost:5221/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// ─── Transaction ───────────────────────────────────────────────
export const getTransactions = async () => {
  const response = await api.get('/Transactions');
  return response.data;
};

export const getTransaction = async (id) => {
  const response = await api.get(`/${id}`);
  return response.data;
};

export const createTransaction = async (transaction) => {
  const response = await api.post('/Transactions', transaction);
  return response.data;
};

export const updateTransaction = async (transaction) => {
  const response = await api.put(`/${transaction.id}`, transaction);
  return response.data;
};

export const deleteTransaction = async (id) => {
  const response = await api.delete(`/${id}`);
  return response.data;
};

// ─── Account ───────────────────────────────────────────────────
export const getAccounts = async () => {
  const response = await api.get('/Accounts');
  return response.data;
};

export const createAccount = async (account) => {
  const response = await api.post('/Accounts', account);
  return response.data;
};

// ─── Category ───────────────────────────────────────────────
export const getCategories = async () => {
  const response = await api.get('/Categories');
  return response.data;
};

export const createCategory = async (category) => {
  const response = await api.post('/Categories', category);
  return response.data;
};

// ─── Transaction Types ───────────────────────────────────────
export const getTransactionTypes = async () => {
  const response = await api.get('/TransactionTypes');
  return response.data;
};

export const createTransactionType = async (transactionType) => {
  const response = await api.post('/TransactionTypes', transactionType);
  return response.data;
};

// ─── Monthly Budgets ─────────────────────────────────────────
export const createMonthlybudgets = async (Budgets) => {
  const response = await api.post('/Monthlybudgets', Budgets);
  return response.data;
};