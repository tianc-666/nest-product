import { useRequest } from "ahooks";
import { Button, Form, Input, message, Space, Table } from "antd";
import { useState } from "react";

import { useForm } from "antd/es/form/Form";
import { groupChatAction } from "../../action/groupChat";
import CreateGroupChat from "./createGroupChat";
import GroupUserInfo from "./GroupUserInfo";
import type { UserInfo } from "../user/Register";
import { useNavigate } from "react-router-dom";

export interface GroupChatListProps {
  id: number;
  name: string;
  type: 1;
  userCount: number;
  useIds: number[];
  useInfo: UserInfo[];
  createTime: string;
}
const GroupChat = () => {
  const [form] = useForm();
  const navigate = useNavigate();
  const [showAddGroupChatForm, setShowAddGroupChatForm] = useState(false);
  const [showGroupUserInfo, setShowGroupUserInfo] = useState(false);
  const [curGroupUserInfo, setCurGroupUserInfo] = useState<GroupChatListProps>(
    {} as GroupChatListProps
  );
  const columns = [
    {
      title: "名称",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "创建时间",
      dataIndex: "createTime",
      key: "createTime",
    },
    {
      title: "人数",
      dataIndex: "userCount",
      key: "userCount",
    },
    {
      title: "操作",
      dataIndex: "",
      key: "operation",
      render: (_: void, row: GroupChatListProps) => (
        <Space>
          <Button
            type="link"
            onClick={async () => {
              const isJoin = await groupChatAction.isJoinChatRoom(row.id);
              if (isJoin.data) {
                navigate(`/chat/${row.id}`);
              } else {
                const res = await groupChatAction.joinGroupChat(row.id);
                if (res) {
                  navigate(`/chat/${row.id}`);
                }
              }
            }}
          >
            聊天
          </Button>
          <Button
            type="link"
            onClick={() => {
              setShowGroupUserInfo(true);
              setCurGroupUserInfo(row);
            }}
          >
            详情
          </Button>
        </Space>
      ),
    },
  ];

  const [dataSource, setDataSource] = useState([]);
  const { run: getGroupChatList } = useRequest(
    groupChatAction.getGroupChatList,
    {
      onSuccess: (res) => {
        setDataSource(res.data || []);
      },
    }
  );
  return (
    <div>
      <div className="flex gap-4">
        <Form layout="horizontal" form={form}>
          <Form.Item label="群聊名称" name="name">
            <Input />
          </Form.Item>
        </Form>
        <Button
          type="primary"
          onClick={async () => {
            const values = await form.validateFields();
            getGroupChatList(values);
          }}
        >
          查询
        </Button>
        <Button
          type="link"
          onClick={() => {
            form.resetFields();
            getGroupChatList({ name: "" });
          }}
        >
          重置
        </Button>
        <Button type="primary" onClick={() => setShowAddGroupChatForm(true)}>
          创建群聊
        </Button>
      </div>
      <div>
        <Table columns={columns} dataSource={dataSource} />
      </div>
      {showAddGroupChatForm && (
        <CreateGroupChat
          visible={showAddGroupChatForm}
          onCancel={() => setShowAddGroupChatForm(false)}
          onOk={async (values) => {
            const res = await groupChatAction.createGroupChat({
              name: values.name,
              type: 1,
            });
            if (res) {
              message.success("创建成功");
              form.resetFields();
              getGroupChatList({ name: "" });
            }
            setShowAddGroupChatForm(false);
          }}
        />
      )}

      {showGroupUserInfo && (
        <GroupUserInfo
          curId={curGroupUserInfo.id}
          open={showGroupUserInfo}
          onCancel={() => setShowGroupUserInfo(false)}
        />
      )}
    </div>
  );
};

export default GroupChat;
