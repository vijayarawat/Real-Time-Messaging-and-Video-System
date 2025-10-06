import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:5000/api/v1", // 👈 change as needed
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, 
  withCredentials: true, 
});

export default instance;
