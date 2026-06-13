/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRequest } from "ahooks";
import { Button, Form, Input } from "antd";
import { Link } from "react-router-dom";
import { userService } from "../../../../action/user";
import { useEffect } from "react";
import CommonUpload from "../../../../components/CommonUpload";

interface LoginRegisterFormProps {
  type: "login" | "register" | "edit";
  onSubmit: (values: any) => void;
  submitButton?: React.ReactNode;
  initialValues?: any;
}

const LoginRegisterForm = ({
  type,
  onSubmit,
  submitButton,
  initialValues,
}: LoginRegisterFormProps) => {
  const isEdit = type === "edit";
  const FormItem = Form.Item;
  const [form] = Form.useForm();
  const { run: getRegisterCaptcha } = useRequest(
    userService.getRegisterCaptcha,
    {
      manual: true,
    }
  );

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(initialValues);
    }
  }, [initialValues]);
  return (
    <div className="w-full max-w-md mx-auto p-4 border border-gray-300 rounded-md shadow-md mt-10">
      <Form
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        form={form}
        labelAlign="left"
        onFinish={onSubmit}
      >
        {type !== "login" && (
          <FormItem label="头像" name="headPic">
            <CommonUpload />
          </FormItem>
        )}
        <FormItem
          label="用户名"
          name="username"
          rules={[{ required: true, message: "请输入用户名" }]}
        >
          <Input placeholder="请输入用户名" />
        </FormItem>

        {!isEdit && (
          <FormItem
            label="密码"
            name="password"
            rules={[{ required: true, message: "请输入密码" }]}
          >
            <Input.Password placeholder="请输入密码" />
          </FormItem>
        )}

        {type !== "login" && (
          <>
            {!isEdit && (
              <FormItem
                label="确认密码"
                name="confirmPassword"
                rules={[
                  { required: true, message: "请输入确认密码" },
                  {
                    validator: async (_, value: string) => {
                      const { password } = form.getFieldsValue(["password"]);
                      if (value !== password) {
                        throw new Error("两次输入密码不一致");
                      }
                    },
                  },
                ]}
              >
                <Input.Password placeholder="请输入确认密码" />
              </FormItem>
            )}

            <FormItem label="昵称" name="nickName">
              <Input placeholder="请输入昵称" />
            </FormItem>

            <FormItem
              label="邮箱"
              name="email"
              rules={[{ required: true, message: "请输入邮箱" }]}
            >
              <Input placeholder="请输入邮箱" />
            </FormItem>
            {!isEdit && (
              <div className="flex justify-between">
                <FormItem
                  label="验证码"
                  name="captch"
                  rules={[{ required: true, message: "请输入验证码" }]}
                >
                  <Input placeholder="请输入验证码" />
                </FormItem>
                <Button
                  className="w-24"
                  type="primary"
                  onClick={async () => {
                    const { email } = await form.validateFields(["email"]);

                    getRegisterCaptcha(email);
                  }}
                >
                  获取验证码
                </Button>
              </div>
            )}
          </>
        )}
        {!isEdit && (
          <Link
            className="text-sm text-blue-500"
            to={type === "login" ? "/register" : "/login"}
          >
            去{type === "login" ? "注册" : "登录"}
          </Link>
        )}

        {submitButton}
      </Form>
    </div>
  );
};

export default LoginRegisterForm;
