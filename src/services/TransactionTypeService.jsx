import api from '../lib/api';

const normalizeDirection = (dir) => {
  if (dir === 'income' || dir === 0 || dir === 'IN') return 'IN';
  if (dir === 'expense' || dir === 1 || dir === 'OUT') return 'OUT';
  return 'IN';
};

const normalizeType = (t) => ({ ...t, direction: normalizeDirection(t.direction) });

const directionToApi = (dir) => (dir === 'IN' ? 'income' : 'expense');

export const getTransactionTypes = async () => {
  const response = await api.get('/TransactionTypes');
  return response.data.map(normalizeType);
};

export const getTransactionType = async (id) => {
  const response = await api.get(`/TransactionTypes/${id}`);
  return normalizeType(response.data);
};

export const createTransactionType = async (transactionType) => {
  const payload = { ...transactionType, direction: directionToApi(transactionType.direction) };
  const response = await api.post('/TransactionTypes', payload);
  return normalizeType(response.data);
};

export const updateTransactionType = async (id, transactionType) => {
  const payload = { ...transactionType, direction: directionToApi(transactionType.direction) };
  const response = await api.put(`/TransactionTypes/${id}`, payload);
  return response.data;
};

export const deleteTransactionType = async (id) => {
  const response = await api.delete(`/TransactionTypes/${id}`);
  return response.data;
};
