import { logoutAPI } from "@/services/api";
import {
  AppstoreOutlined,
  DollarCircleOutlined,
  ExceptionOutlined,
  HeartTwoTone,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Avatar, Dropdown, Layout, Menu, Space } from "antd";
import React, { useEffect, useMemo, useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { useCurrentApp } from "../context/app.context";

const { Content, Footer, Sider } = Layout;

const LayoutAdmin = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string>("");
  const { isAuthenticated, user, setUser, setIsAuthenticated } =
    useCurrentApp();

  const location = useLocation();

  const items = useMemo(() => {
    return [
      {
        label: <Link to="/admin">Dashboard</Link>,
        key: "/admin",
        icon: <AppstoreOutlined />,
      },
      {
        label: <span>Manage Users</span>,
        key: "/admin/user",
        icon: <UserOutlined />,
        children: [
          {
            label: <Link to="/admin/user">CRUD</Link>,
            key: "/admin/user",
            icon: <TeamOutlined />,
          },
        ],
      },
      {
        label: <Link to="/admin/book">Manage Books</Link>,
        key: "/admin/book",
        icon: <ExceptionOutlined />,
      },
      {
        label: <Link to="/admin/order">Manage Orders</Link>,
        key: "/admin/order",
        icon: <DollarCircleOutlined />,
      },
    ];
  }, []);

  useEffect(() => {
    console.log(location.pathname);

    if (items && items.length > 0) {
      for (let i = 0; i < items.length; i++) {
        if (items[i].key === location.pathname) {
          setActiveMenu(items[i].key);
          return;
        }
      }
    }
  }, [location, items]);

  const handleLogout = async () => {
    const res = await logoutAPI();
    if (res.data) {
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem("access_token");
    }
  };

  const itemsDropdown = [
    {
      label: (
        <label style={{ cursor: "pointer" }} onClick={() => alert("me")}>
          Quản lý tài khoản
        </label>
      ),
      key: "account",
    },
    {
      label: <Link to={"/"}>Trang chủ</Link>,
      key: "home",
    },
    {
      label: (
        <label style={{ cursor: "pointer" }} onClick={() => handleLogout()}>
          Đăng xuất
        </label>
      ),
      key: "logout",
    },
  ];

  const urlAvatar = `${import.meta.env.VITE_BACKEND_URL}/images/avatar/${
    user?.avatar
  }`;

  if (!isAuthenticated) {
    return <Outlet />;
  }

  const isAdminRoute = location.pathname.includes("/admin");
  if (isAuthenticated && isAdminRoute) {
    const role = user?.role;
    if (role === "USER") {
      return <Outlet />;
    }
  }

  console.log("activeMenu", activeMenu);
  return (
    <>
      <Layout style={{ minHeight: "100vh" }} className="layout-admin">
        <Sider
          theme="light"
          collapsible
          collapsed={collapsed}
          onCollapse={(value) => setCollapsed(value)}
        >
          <div style={{ height: 32, margin: 16, textAlign: "center" }}>
            Admin
          </div>
          <Menu
            defaultSelectedKeys={[activeMenu]}
            selectedKeys={[activeMenu]}
            mode="inline"
            items={items}
            onClick={(e) => setActiveMenu(e.key)}
          />
        </Sider>
        <Layout>
          <div
            className="admin-header"
            style={{
              height: "50px",
              borderBottom: "1px solid #ebebeb",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0 15px",
            }}
          >
            <span>
              {React.createElement(
                collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
                {
                  className: "trigger",
                  onClick: () => setCollapsed(!collapsed),
                }
              )}
            </span>
            <Dropdown menu={{ items: itemsDropdown }} trigger={["click"]}>
              <Space style={{ cursor: "pointer" }}>
                <Avatar src={urlAvatar} />
                {user?.fullName}
              </Space>
            </Dropdown>
          </div>
          <Content style={{ padding: "15px" }}>
            <Outlet />
          </Content>
          <Footer style={{ padding: 0, textAlign: "center" }}>
            BookStore &copy; vvm1004 - Made with <HeartTwoTone />
          </Footer>
        </Layout>
      </Layout>
    </>
  );
};

export default LayoutAdmin;
