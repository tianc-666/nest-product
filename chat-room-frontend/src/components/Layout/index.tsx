/* eslint-disable react-hooks/set-state-in-effect */
import {
  FolderOutlined,
  GroupOutlined,
  HomeOutlined,
  MessageOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Menu, type MenuProps } from "antd";
import { useEffect, useState } from "react";
import { useNavigate, useOutlet } from "react-router-dom";
type MenuItem = Required<MenuProps>["items"][number];
const items: MenuItem[] = [
  {
    key: "/home",
    label: "首页",
    icon: <HomeOutlined />,
  },
  {
    key: "friends",
    label: "好友列表",
    icon: <UserOutlined />,
  },
  {
    key: "group",
    label: "群聊",
    icon: <GroupOutlined />,
  },
  {
    key: "/message",
    label: "通知",
    icon: <MessageOutlined />,
  },
  {
    key: "/chat",
    label: "聊天",
    icon: <MessageOutlined />,
  },
  {
    key: "/favorite",
    label: "收藏",
    icon: <FolderOutlined />,
  },
];

const Layout = () => {
  const outlet = useOutlet();

  const navigate = useNavigate();

  const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");

  const [current, setCurrent] = useState("/home");

  const onClick: MenuProps["onClick"] = (e) => {
    setCurrent(e.key);
    navigate(e.key);
  };

  useEffect(() => {
    setCurrent(window.location.pathname?.replace("/", ""));
  }, [window.location.pathname]);

  return (
    <div className="h-screen flex flex-col">
      <div className="bg-gray-800 text-white p-4 flex justify-between items-center">
        <div className="text-2xl font-bold" onClick={() => navigate("/home")}>
          聊天室
        </div>
        <div className="flex items-center space-x-4">
          <img
            src={userInfo?.headPic}
            onClick={() => navigate("/user")}
            className="w-10 h-10 rounded-full"
          />

          <div onClick={() => navigate("/user/change-password")}>修改密码</div>
        </div>
      </div>
      <div className="flex">
        <div>
          <Menu
            onClick={onClick}
            style={{ width: 256 }}
            selectedKeys={[current]}
            mode="inline"
            items={items}
          />
        </div>
        <div className="flex-1 overflow-auto bg-gray-100 h-[calc(100vh-72px)] px-4 py-2">
          {outlet}
        </div>
      </div>
    </div>
  );
};

export default Layout;
