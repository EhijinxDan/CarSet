import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const axiosInstance = axios.create({
  baseURL: API_URL,
});

axiosInstance.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const register = async (name, email, password) => {
  const response = await axiosInstance.post('/register', { name, email, password });
  return response.data;
};

const login = async (email, password) => {
  const response = await axiosInstance.post('/login', { email, password });
  return response.data;
};

const getTasks = async () => {
  const response = await axiosInstance.get('/tasks');
  return response.data;
};

const createTask = async (task) => {
  const response = await axiosInstance.post('/tasks', task);
  return response.data;
};

const updateTask = async (id, updates) => {
  const response = await axiosInstance.put(`/tasks/${id}`, updates);
  return response.data;
};

const deleteTask = async (id) => {
  const response = await axiosInstance.delete(`/tasks/${id}`);
  return response.data;
};

export default {
  register,
  login,
  getTasks,
  createTask,
  updateTask,
  deleteTask,
};
