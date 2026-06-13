/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRequest } from "ahooks";
import { Button, message, Popconfirm, Table } from "antd";
import { favoriteAction } from "../../action/favorite";
import { useState } from "react";
import { FileDoneOutlined } from "@ant-design/icons";

interface chatHistoryProps {
  content: any;
  type: number;
}

interface FavotireListProps {
  id: number;
  chatHistoryId: number;
  userId: number;
  chatHistory: chatHistoryProps;
}

const Favorite = () => {
  const [favoriteList, setFavoriteList] = useState([]);

  const { run: getFavoriteList } = useRequest(favoriteAction.getFavoriteList, {
    onSuccess: (res) => {
      setFavoriteList(res.data || []);
    },
  });

  const contentByType = (record: {
    type: number;
    content: chatHistoryProps["content"];
  }) => {
    const { content, type } = record;
    switch (type) {
      case 0:
        return <div>{content}</div>;
      case 1:
        return (
          <img src={content} alt="图片" style={{ width: 100, height: 100 }} />
        );
      case 2:
        return (
          <div>
            <FileDoneOutlined /> {content}
          </div>
        );
      default:
        return "";
    }
  };
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "聊天内容",
      dataIndex: "name",
      key: "name",
      render: (_: void, record: FavotireListProps) =>
        contentByType(record.chatHistory),
    },
    {
      title: "创建时间",
      dataIndex: "createTime",
      key: "createTime",
    },
    {
      title: "操作",
      dataIndex: "action",
      key: "action",
      render: (_: void, record: FavotireListProps) => (
        <Popconfirm
          title="删除收藏"
          description="Are you sure to delete this favorite?"
          okText="Yes"
          cancelText="No"
          onConfirm={async () => {
            const res = await favoriteAction.delFavorite({
              chatHistoryId: record.chatHistoryId,
            });
            if (res) {
              message.success("删除成功");
              getFavoriteList();
            }
          }}
        >
          <Button type="link">删除</Button>
        </Popconfirm>
      ),
    },
  ];

  return (
    <div>
      <Table columns={columns} dataSource={favoriteList} />
    </div>
  );
};

export default Favorite;
