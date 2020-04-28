import axios from "axios";

const config = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

export default config;