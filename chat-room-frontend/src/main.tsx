import { createRoot } from "react-dom/client";

import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import "./style/common.css";

import "@ant-design/v5-patch-for-react-19";

createRoot(document.getElementById("root")!).render(
  <>
    <RouterProvider router={router} />
  </>
);
