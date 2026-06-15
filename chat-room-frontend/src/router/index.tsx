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

// Mobile pages
import MobileLogin from "../pages/mobile/pages/Login";
import MobileRegister from "../pages/mobile/pages/Register";
import MessageList from "../pages/mobile/pages/MessageList";
import Contacts from "../pages/mobile/pages/Contacts";
import Me from "../pages/mobile/pages/Me";
import ChatDetail from "../pages/mobile/pages/ChatDetail";

// PC route guard
const RequireAuth = () => {
  const token = localStorage.getItem("token");
  return token ? <Outlet /> : <Navigate to="/login" replace />;
};

// Mobile route guard
const MobileRequireAuth = () => {
  const token = localStorage.getItem("token");
  return token ? <Outlet /> : <Navigate to="/m/login" replace />;
};

// Mobile layout
const MobileLayout = () => {
  return (
    <div style={{ maxWidth: "100vw", minHeight: "100vh", background: "#f5f5f5" }}>
      <Outlet />
    </div>
  );
};

const route: RouteObject[] = [
  // PC routes
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <RequireAuth />,
        children: [
          { path: "/home", element: <Home /> },
          { path: "/user", element: <UserPage /> },
          { path: "/user/change-password", element: <ChangePassword /> },
          { path: "/friends", element: <FriendsList /> },
          { path: "/group", element: <GroupChat /> },
          { path: "/message", element: <Message /> },
          { path: "/chat/:chatroomId?", element: <Chat /> },
          { path: "/favorite", element: <Favorite /> },
        ],
      },
    ],
  },
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },

  // Mobile routes
  {
    path: "/m",
    element: <MobileLayout />,
    children: [
      {
        path: "",
        element: <MobileRequireAuth />,
        children: [
          { index: true, element: <Navigate to="/m/message" replace /> },
          { path: "message", element: <MessageList /> },
          { path: "contacts", element: <Contacts /> },
          { path: "me", element: <Me /> },
          { path: "chat/:chatroomId", element: <ChatDetail /> },
        ],
      },
    ],
  },
  { path: "/m/login", element: <MobileLogin /> },
  { path: "/m/register", element: <MobileRegister /> },
];

export const router = createBrowserRouter(route);
