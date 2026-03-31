import axios from 'axios';

// Ajuste a porta conforme o terminal do dotnet run
const BASE_URL = 'http://localhost:5221/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// ─── Transações ───────────────────────────────────────────────
export const getTransacoes = async () => {
  const response = await api.get('/Transactions');
  return response.data;
};

export const criarTransacao = async (transacao) => {
  const response = await api.post('/Transactions', transacao);
  return response.data;
};

// ─── Contas ───────────────────────────────────────────────────
export const getContas = async () => {
  const response = await api.get('/Accounts');
  return response.data;
};

export const criarConta = async (conta) => {
  const response = await api.post('/Accounts', conta);
  return response.data;
};

// ─── Categorias ───────────────────────────────────────────────
export const getCategorias = async () => {
  const response = await api.get('/Categories');
  return response.data;
};

export const criarCategoria = async (categoria) => {
  const response = await api.post('/Categories', categoria);
  return response.data;
};

// ─── Tipos de Transação ───────────────────────────────────────
export const getTiposTransacao = async () => {
  const response = await api.get('/TransactionTypes');
  return response.data;
};

export const criarTipoTransacao = async (tipo) => {
  const response = await api.post('/TransactionTypes', tipo);
  return response.data;
};

// ─── Orçamento Mensal ─────────────────────────────────────────
export const criarOrcamento = async (orcamento) => {
  const response = await api.post('/Monthlybudgets', orcamento);
  return response.data;
};