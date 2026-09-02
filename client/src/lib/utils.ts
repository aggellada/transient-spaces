import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
    Authorization: "Bearer YOUR_SECRET_TOKEN",
  },
  withCredentials: true,
});

export default api;
