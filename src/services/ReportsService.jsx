import api from '../lib/api';

export const getDashboardData = async (month, year, accountId = null) => {
  const params = accountId ? { accountId } : {};
  const response = await api.get(`/Reports/dashboard/${month}/${year}`, { params });
  return response.data;
};

export const getAnnualReport = async (year) => {
  const response = await api.get(`/Reports/annual/${year}`);
  return response.data;
};
