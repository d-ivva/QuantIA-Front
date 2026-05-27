import api from '../lib/api';

export const sendMessage = async (provider, sessionId, message) => {
  const { data } = await api.post('/aichat', { provider, sessionId, message });
  return data;
};

export const clearChatHistory = async (sessionId) => {
  await api.delete(`/aichat/historico/${sessionId}`);
};

export const generateSessionId = () =>
  'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
