import { Form, Input, Modal } from "antd";

export interface AddChatRoomUserProps {
  open: boolean;
  onCancel: () => void;
  onOk: (values: { friendNames: string }) => void;
}
const AddChatRoomUser = ({ open, onCancel, onOk }: AddChatRoomUserProps) => {
  const [form] = Form.useForm();

  return (
    <Modal
      open={open}
      onCancel={onCancel}
      onOk={async () => {
        const values = await form.validateFields();
        onOk(values);
      }}
      title="添加用户"
    >
      <Form form={form}>
        <Form.Item
          label="好友用户名"
          name="friendNames"
          rules={[{ required: true, message: "请输入好友用户名" }]}
        >
          <Input placeholder="请输入好友用户名" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddChatRoomUser;
