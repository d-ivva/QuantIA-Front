import axios from 'axios';

const BASE_URL = 'http://localhost:5221/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

export const getDashboardData = async (month, year) => {
  const response = await api.get(`/Reports/dashboard/${month}/${year}`);
  return response.data;
};

export const getAnnualReport = async (year) => {
  const response = await api.get(`/Reports/annual/${year}`);
  return response.data;
};