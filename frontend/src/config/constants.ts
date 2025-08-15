export const API_HOST = import.meta.env.VITE_API_HOST || 'http://localhost';
export const API_PORT = import.meta.env.VITE_API_PORT || '8000';
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

export const API_KEY = import.meta.env.VITE_API_KEY;
export const API_VERSION = import.meta.env.VITE_API_VERSION;
export const API_DEBUG = import.meta.env.VITE_API_DEBUG;
export const API_TOKEN = import.meta.env.VITE_API_TOKEN;
export const API_URL = `${API_HOST}:${API_PORT}${API_BASE_URL}`;

