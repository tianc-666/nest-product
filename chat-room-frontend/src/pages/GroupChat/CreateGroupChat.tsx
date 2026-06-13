import { Form, Input, Modal } from "antd";

interface CreateGroupChatProps {
  visible: boolean;
  onCancel: () => void;
  onOk: (values: { name: string }) => void;
}
const CreateGroupChat = ({ visible, onCancel, onOk }: CreateGroupChatProps) => {
  const [form] = Form.useForm();
  return (
    <Modal
      title="创建群聊"
      open={visible}
      onCancel={onCancel}
      onOk={async () => {
        const values = await form.validateFields();
        onOk(values);
      }}
    >
      <Form form={form}>
        <Form.Item
          rules={[{ required: true, message: "请输入群聊名称" }]}
          label="群聊名称"
          name="name"
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateGroupChat;
