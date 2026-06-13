/* eslint-disable @typescript-eslint/no-explicit-any */
import { message } from "antd";
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:3000",
  timeout: 10000,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      message.error("未授权，请重新登录");
      localStorage.removeItem("token");
      window.location.href = "/login";
      return Promise.reject(error);
    }
    message.error(error.response?.data?.message || "请求失败");
    return Promise.reject(error);
  }
);

export default axiosInstance;
