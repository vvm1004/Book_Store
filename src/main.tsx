import ProtectedRoute from "@/components/auth";
import Layout from "@/layout";
import { App, ConfigProvider } from "antd";
import enUS from "antd/locale/en_US";
import LayoutAdmin from "components/layout/layout.admin";
import ManageBookPage from "pages/admin/manage.book";
import ManageOrderPage from "pages/admin/manage.order";
import ManageUserPage from "pages/admin/manage.user";
import AboutPage from "pages/client/about";
import LoginPage from "pages/client/auth/login";
import RegisterPage from "pages/client/auth/register";
import BookPage from "pages/client/book";
import HomePage from "pages/client/home";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "src/index.css";
import "styles/global.scss";
import BookLoader from "./components/book/loader.book";
import { AppProvider } from "./components/context/app.context";
import DashBoardPage from "./pages/admin/dashboard";
import OrderPage from "./pages/client/order";
import HistoryPage from "./pages/client/history";
const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "/book/:id",
        element: <BookPage />,
      },
      {
        path: "/order",
        element: (
          <ProtectedRoute>
            <OrderPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/book/skeleton",
        element: <BookLoader />,
      },
      {
        path: "/about",
        element: <AboutPage />,
      },
      {
        path: "/history",
        element: (
          <ProtectedRoute>
            <HistoryPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/checkout",
        element: (
          <ProtectedRoute>
            <div>checkout page</div>
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: "admin",
    element: <LayoutAdmin />,
    children: [
      {
        index: true,
        element: (
          <ProtectedRoute>
            <DashBoardPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "book",
        element: (
          <ProtectedRoute>
            <ManageBookPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "order",
        element: (
          <ProtectedRoute>
            <ManageOrderPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "user",
        element: (
          <ProtectedRoute>
            <ManageUserPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/admin",
        element: (
          <ProtectedRoute>
            <div>admin page</div>
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App>
      <AppProvider>
        <ConfigProvider locale={enUS}>
          <RouterProvider router={router} />
        </ConfigProvider>
      </AppProvider>
    </App>
  </StrictMode>
);
