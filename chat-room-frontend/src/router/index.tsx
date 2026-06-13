/* eslint-disable react-refresh/only-export-components */
import {
  createBrowserRouter,
  type RouteObject,
  Navigate,
  Outlet,
} from "react-router-dom";
import Layout from "../components/Layout";
import Login from "../pages/user/Login";
import Register from "../pages/user/Register";
import UserPage from "../pages/user/UserInfo";
import ChangePassword from "../pages/user/ChangePassword";
import FriendsList from "../pages/FriendsList";
import Home from "../pages/home";
import GroupChat from "../pages/GroupChat";
import Message from "../pages/Message";
import Chat from "../pages/Chat";
import Favorite from "../pages/Favorite";

// 路由守卫组件：检查登录状态
const RequireAuth = () => {
  const token = localStorage.getItem("token");
  // 如果没有token，重定向到登录页
  return token ? <Outlet /> : <Navigate to="/login" replace />;
};

const route: RouteObject[] = [
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <RequireAuth />,
        children: [
          {
            path: "/home",
            element: <Home />,
          },
          {
            path: "/user",
            element: <UserPage />,
          },
          {
            path: "/user/change-password",
            element: <ChangePassword />,
          },
          {
            path: "/friends",
            element: <FriendsList />,
          },
          {
            path: "/group",
            element: <GroupChat />,
          },
          {
            path: "/message",
            element: <Message />,
          },
          {
            path: "/chat/:chatroomId?",
            element: <Chat />,
          },
          {
            path: "/favorite",
            element: <Favorite />,
          },
        ],
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
];

export const router = createBrowserRouter(route);
