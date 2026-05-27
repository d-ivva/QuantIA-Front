import api from '../lib/api';

export const getDashboardData = async (month, year) => {
  const response = await api.get(`/Reports/dashboard/${month}/${year}`);
  return response.data;
};

export const getAnnualReport = async (year) => {
  const response = await api.get(`/Reports/annual/${year}`);
  return response.data;
};
