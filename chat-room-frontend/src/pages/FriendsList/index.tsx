import { useRequest } from "ahooks";
import { Button, Form, Input, message, Table } from "antd";
import { friendsService } from "../../action/friends";
import { useState } from "react";
import type { UserInfo } from "../user/Register";
import { useForm } from "antd/es/form/Form";
import AddFriendFormModal from "./AddFriendForm";
import { useNavigate } from "react-router-dom";

const FriendsList = () => {
  const [form] = useForm();
  const navigate = useNavigate();
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: "10%",
    },
    {
      title: "用户名",
      dataIndex: "username",
      key: "username",
      width: "10%",
    },
    {
      title: "头像",
      dataIndex: "headPic",
      key: "headPic",
      width: "10%",
      render: (value: string) => (
        <img src={value} className="w-10 h-10 rounded-full" />
      ),
    },
    {
      title: "名称",
      dataIndex: "nickName",
      key: "nickName",
      width: "80%",
    },

    {
      title: "操作",
      dataIndex: "",
      key: "operation",
      render: (_: void, item: UserInfo) => (
        <div className="flex gap-2">
          <Button type="link" onClick={() => goToChat(item.id)}>
            聊天
          </Button>
        </div>
      ),
    },
  ];

  const [showAddFriendForm, setShowAddFriendForm] = useState(false);
  const [dataSource, setDataSource] = useState<UserInfo[]>([]);
  const { run: getFriendsList } = useRequest(friendsService.getFriendsList, {
    onSuccess: (res) => {
      setDataSource(res.data || []);
    },
  });

  const goToChat = async (id: number) => {
    const findChatId = await friendsService.findChatRoomId({ friendId: id });
    if (findChatId.data) {
      navigate(`/chat/${findChatId.data}`);
    } else {
      const res = await friendsService.createChatRoom({
        friendId: id,
        type: 0,
      });
      if (res.data) {
        navigate(`/chat/${res.data}`);
      } else {
        message.error("创建聊天房间失败");
      }
    }
  };
  return (
    <div>
      <div className="flex gap-4">
        <Form layout="horizontal" form={form}>
          <Form.Item label="名称" name="nickName">
            <Input style={{ width: 200 }} />
          </Form.Item>
        </Form>
        <Button
          type="primary"
          onClick={async () => {
            const values = await form.validateFields();
            getFriendsList(values);
          }}
        >
          查询
        </Button>
        <Button
          type="link"
          onClick={() => {
            form.resetFields();
            getFriendsList();
          }}
        >
          重置
        </Button>
        <Button type="primary" onClick={() => setShowAddFriendForm(true)}>
          添加好友
        </Button>
      </div>
      <div>
        <Table columns={columns} dataSource={dataSource} />
      </div>
      {showAddFriendForm && (
        <AddFriendFormModal
          visible={showAddFriendForm}
          onCancel={() => setShowAddFriendForm(false)}
          onOk={async (form) => {
            const values = await form.validateFields();
            const res = await friendsService.addFriend(values);

            if (res) {
              message.success("添加成功");
              form.resetFields();
              getFriendsList();
            }
            setShowAddFriendForm(false);
          }}
        />
      )}
    </div>
  );
};

export default FriendsList;
