/* eslint-disable @typescript-eslint/no-explicit-any */
import { userService } from "../../../action/user";
import { Button, message } from "antd";
import LoginRegisterForm from "../components/LoginRegisterForm";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navagate = useNavigate();
  const onSubmit = async (values: any) => {
    const res: any = await userService.login(values);
    if (res.data) {
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userInfo", JSON.stringify(res.data.user));
      message.success("登录成功,跳转首页");
      navagate("/");
    }
  };
  return (
    <div className="w-full max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-center text-gray-800">登录</h2>
      <LoginRegisterForm
        type="login"
        onSubmit={onSubmit}
        submitButton={
          <Button type="primary" htmlType="submit" className="w-full">
            登录
          </Button>
        }
      />
    </div>
  );
};

export default Login;
