import axios from "axios";

export const AUTH_STORAGE_KEYS = {
  token: "inventory.auth.token",
  user: "inventory.auth.user",
};

export const readStoredToken = () => localStorage.getItem(AUTH_STORAGE_KEYS.token);

export const readStoredUser = () => {
  const raw = localStorage.getItem(AUTH_STORAGE_KEYS.user);
  if (!raw) {
    return null;
  }
  try {
    return JSON.parse(raw);
  } catch {
    localStorage.removeItem(AUTH_STORAGE_KEYS.user);
    return null;
  }
};

export const writeStoredSession = (authResponse) => {
  localStorage.setItem(AUTH_STORAGE_KEYS.token, authResponse.access_token);
  localStorage.setItem(AUTH_STORAGE_KEYS.user, JSON.stringify(authResponse.user));
};

export const clearStoredSession = () => {
  localStorage.removeItem(AUTH_STORAGE_KEYS.token);
  localStorage.removeItem(AUTH_STORAGE_KEYS.user);
};

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

API.interceptors.request.use((config) => {
  const token = readStoredToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && readStoredToken()) {
      clearStoredSession();
      window.dispatchEvent(new Event("auth:session-expired"));
    }
    return Promise.reject(error);
  },
);

export default API;
