import axios from "axios";

const baseURL = `${import.meta.env.VITE_SERVER_ACCESS}/api`;

const axiosInst = axios.create({
  baseURL: baseURL,
  timeout: 5000,
  headers: { "Content-Type": "application/json" },
});

export default axiosInst;
