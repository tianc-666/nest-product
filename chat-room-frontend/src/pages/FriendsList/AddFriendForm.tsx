import { Form, Input, Modal, type FormInstance } from "antd";

interface AddFriendFormProps {
  visible: boolean;
  onCancel: () => void;
  onOk: (form: FormInstance) => void;
}
const AddFriendFormModal = ({
  visible,
  onCancel,
  onOk,
}: AddFriendFormProps) => {
  const [form] = Form.useForm();
  return (
    <Modal
      title="添加好友"
      open={visible}
      onCancel={onCancel}
      onOk={() => onOk(form)}
    >
      <Form layout="horizontal" form={form}>
        <Form.Item
          label="用户名"
          name="username"
          rules={[{ required: true, message: "请输入用户名" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item label="申请理由" name="reason">
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddFriendFormModal;
