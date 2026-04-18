import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000"
});

// 🔐 Attach token (future-ready)
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");

  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req;
});

// ⚠️ Handle auth errors (disabled for now)
API.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("Unauthorized (ignored for now)");
      // later you can enable redirect
    }
    return Promise.reject(error);
  }
);

export default API;