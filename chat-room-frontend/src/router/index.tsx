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
import MobileUserInfo from "../pages/mobile/pages/UserInfo";
import MobileChangePassword from "../pages/mobile/pages/ChangePassword";
import FriendRequests from "../pages/mobile/pages/FriendRequests";
import AddFriend from "../pages/mobile/pages/AddFriend";

// Detect mobile device
const isMobile = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
};

// Auto redirect to mobile/desktop based on device
const AutoRedirect = () => {
  if (isMobile()) {
    return <Navigate to="/m/message" replace />;
  }
  return <Navigate to="/home" replace />;
};

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
  // Root - auto detect device
  { path: "/", element: <AutoRedirect /> },

  // PC routes
  {
    path: "/pc",
    element: <Layout />,
    children: [
      {
        path: "",
        element: <RequireAuth />,
        children: [
          { path: "home", element: <Home /> },
          { path: "user", element: <UserPage /> },
          { path: "user/change-password", element: <ChangePassword /> },
          { path: "friends", element: <FriendsList /> },
          { path: "group", element: <GroupChat /> },
          { path: "message", element: <Message /> },
          { path: "chat/:chatroomId?", element: <Chat /> },
          { path: "favorite", element: <Favorite /> },
        ],
      },
    ],
  },
  // Keep old PC paths working
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
          { path: "contacts/add-friend", element: <AddFriend /> },
          { path: "contacts/friend-requests", element: <FriendRequests /> },
          { path: "contacts/groups", element: <Contacts /> },
          { path: "contacts/detail/:id", element: <ChatDetail /> },
          { path: "me", element: <Me /> },
          { path: "me/info", element: <MobileUserInfo /> },
          { path: "me/password", element: <MobileChangePassword /> },
          { path: "chat/:chatroomId", element: <ChatDetail /> },
          { path: "friends", element: <FriendsList /> },
          { path: "group", element: <GroupChat /> },
          { path: "favorite", element: <Favorite /> },
        ],
      },
    ],
  },
  { path: "/m/login", element: <MobileLogin /> },
  { path: "/m/register", element: <MobileRegister /> },
];

export const router = createBrowserRouter(route);
