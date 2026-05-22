// All API calls go through this single file
// VITE_API_URL is injected from .env at build time by Vite

import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
