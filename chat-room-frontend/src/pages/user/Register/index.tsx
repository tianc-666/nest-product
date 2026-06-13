/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import LoginRegisterForm from "../components/LoginRegisterForm";
import { userService } from "../../../action/user";
import { Button, message } from "antd";
import { useNavigate } from "react-router-dom";

export interface UserInfo {
  id: number;
  username: string;
  captcha: string;
  email: string;
  nickName: string;
}

interface RegisterFormValues extends UserInfo {
  confirmPassword: string;
  password: string;
}

const Register = () => {
  const navagate = useNavigate();
  const onSubmit = async (values: RegisterFormValues) => {
    const { confirmPassword, ...rest } = values;
    const submitValues = rest;
    const res = await userService.register(submitValues);

    if (res.data) {
      message.success("注册成功,跳转登录页面");
      navagate("/login");
    }
  };
  return (
    <div className="w-full max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-center text-gray-800">注册</h2>
      <LoginRegisterForm
        type="register"
        onSubmit={onSubmit}
        submitButton={
          <Button type="primary" htmlType="submit" className="w-full">
            注册
          </Button>
        }
      />
    </div>
  );
};

export default Register;
