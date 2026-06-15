/* eslint-disable react-refresh/only-export-components */
import { createBrowserRouter, type RouteObject, Navigate, Outlet } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MessageList from "./pages/MessageList";
import Contacts from "./pages/Contacts";
import Me from "./pages/Me";
import ChatDetail from "./pages/ChatDetail";

const RequireAuth = () => {
  const token = localStorage.getItem("token");
  return token ? <Outlet /> : <Navigate to="/m/login" replace />;
};

const MobileLayout = () => {
  return (
    <div style={{ maxWidth: "100vw", minHeight: "100vh", background: "#f5f5f5" }}>
      <Outlet />
    </div>
  );
};

const mobileRoutes: RouteObject[] = [
  {
    path: "/m",
    element: <MobileLayout />,
    children: [
      {
        path: "",
        element: <RequireAuth />,
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
  { path: "/m/login", element: <Login /> },
  { path: "/m/register", element: <Register /> },
];

export const mobileRouter = createBrowserRouter(mobileRoutes);
