import type { UserInfo } from "../pages/user/Register";
import axiosInstance from "../utils/axios";

interface LoginDto {
  username: string;
  password: string;
}

export const userService = {
  login: (data: LoginDto) => axiosInstance.post("/user/login", data),
  register: (data: LoginDto) => axiosInstance.post("/user/register", data),
  getRegisterCaptcha: (email: string) =>
    axiosInstance.get(`/user/create-captcha?email=${email}`),
  getUserInfo: () => axiosInstance.get("/user/info"),
  updateUserInfo: (data: UserInfo) =>
    axiosInstance.post("/user/modify-userinfo", data),
  getModifyPasswordCaptcha: (email: string) =>
    axiosInstance.get(`/user/modify-password-captch?email=${email}`),
  modifyPassword: (data: {
    password: string;
    confirmPassword: string;
    email: string;
    captcha: string;
  }) => axiosInstance.post("/user/modify-password", data),
};
