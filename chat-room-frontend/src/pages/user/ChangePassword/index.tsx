import { Button, Form, Input, message } from "antd";
import { useForm } from "antd/es/form/Form";
import { userService } from "../../../action/user";

const ChangePassword = () => {
  const [form] = useForm();

  const onSubmit = async (value: {
    password: string;
    confirmPassword: string;
    email: string;
    captcha: string;
  }) => {
    const res = await userService.modifyPassword(value);
    if (res.data) {
      message.success("修改密码成功");
    }
  };
  return (
    <div className="flex justify-center items-center mt-10">
      <Form
        form={form}
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
        onFinish={onSubmit}
      >
        <Form.Item
          label="密码"
          name="password"
          rules={[{ required: true, message: "请输入密码" }]}
        >
          <Input.Password placeholder="请输入密码" />
        </Form.Item>
        <Form.Item
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
        </Form.Item>
        <Form.Item
          label="邮箱"
          name="email"
          rules={[{ required: true, message: "请输入邮箱" }]}
        >
          <Input placeholder="请输入邮箱" />
        </Form.Item>
        <div className="flex gap-2">
          <Form.Item
            label="验证码"
            name="captch"
            rules={[{ required: true, message: "请输入验证码" }]}
          >
            <Input placeholder="请输入验证码" />
          </Form.Item>
          <Button
            type="primary"
            onClick={async () => {
              const { email } = await form.validateFields(["email"]);

              await userService.getModifyPasswordCaptcha(email);
            }}
          >
            获取验证码
          </Button>
        </div>

        <Button type="primary" htmlType="submit" className="w-full">
          提交
        </Button>
      </Form>
    </div>
  );
};

export default ChangePassword;
