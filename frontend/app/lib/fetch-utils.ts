import axios from "axios";
import path from "path";

const BASE_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      window.dispatchEvent(new Event("force-logout"));
    }
    return Promise.reject(error);
  }
);

const postData = async <T>(path: string, data: unknown): Promise<T> => {
  try {
    const response = await api.post(path, data);
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

const fetchData = async <T>(path: string): Promise<T> => {
  try {
    const response = await api.get(path);
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

const updateData = async <T>(path: string, data: unknown): Promise<T> => {
  try {
    const response = await api.put(path, data);
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

const deleteData = async <T>(path: string): Promise<T> => {
  try {
    const response = await api.delete(path);
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

export { postData, fetchData, updateData, deleteData };
