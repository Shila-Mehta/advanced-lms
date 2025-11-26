import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001", // backend port
  withCredentials: true, // important for cookies (refreshToken)
});

export default api;
