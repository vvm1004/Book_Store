import { logoutAPI } from "@/services/api";
import {
  Avatar,
  Badge,
  Divider,
  Drawer,
  Dropdown,
  Image,
  Popover,
  Space,
} from "antd";
import { useState } from "react";
import { FaReact } from "react-icons/fa";
import { FiShoppingCart } from "react-icons/fi";
import { VscSearchFuzzy } from "react-icons/vsc";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useCurrentApp } from "../context/app.context";
import "./app.header.scss";
import ManageAccount from "../account/manage.account";
import { isMobile } from "react-device-detect";

interface IProps {
  searchTerm: string;
  setSearchTerm: (v: string) => void;
}
const AppHeader = (props: IProps) => {
  const [openDrawer, setOpenDrawer] = useState(false);
  const [openModalAccount, setOpenModalAccount] = useState(false);
  const { searchTerm, setSearchTerm } = props;
  const nav = useNavigate();

  const {
    isAuthenticated,
    setIsAuthenticated,
    user,
    setUser,
    carts,
    setCarts,
  } = useCurrentApp();

  const navigate = useNavigate();

  const handleLogout = async () => {
    const res = await logoutAPI();
    if (res.data) {
      setUser(null);
      setIsAuthenticated(false);
      setCarts([]);
      localStorage.removeItem("access_token");
      localStorage.removeItem("carts");
    }
  };

  let items = [
    {
      label: (
        <label
          style={{ cursor: "pointer" }}
          onClick={() => {
            setOpenModalAccount(true);
          }}
        >
          Quản lý tài khoản
        </label>
      ),
      key: "account",
    },
    {
      label: <Link to="/history">Lịch sử mua hàng</Link>,
      key: "history",
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

  if (user?.role === "ADMIN") {
    items.unshift({
      label: <Link to="/admin">Trang quản trị</Link>,
      key: "admin",
    });
  }

  const urlAvatar = `${import.meta.env.VITE_BACKEND_URL}/images/avatar/${
    user?.avatar
  }`;

  const contentPopover = () => {
    const baseUrl = import.meta.env.VITE_BACKEND_URL + "/images/book/";
    return (
      <div className="pop-cart-body flex flex-col space-y-2">
        {carts?.map((cart) => {
          return (
            <div className="flex" key={cart._id}>
              <div>
                <Image
                  src={baseUrl + cart.detail.thumbnail}
                  width={50}
                  preview={false}
                />
              </div>
              <div className="flex justify-center space-x-1">
                <p className="text-[12px]">{cart.detail.mainText}</p>
                <span className="text-[12px] text-orange-500 capitalize">
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(cart.detail.price)}
                </span>
              </div>
            </div>
          );
        })}
        <div className="flex end-4 justify-end">
          <button
            onClick={() => navigate("/order")}
            className="px-3 h-[40px] bg-orange-600 text-white rounded-sm border-none cursor-pointer hover:bg-orange-500"
          >
            Xem giỏ hàng
          </button>
        </div>
      </div>
    );
  };
  return (
    <>
      <div className="header-container">
        <header className="page-header">
          <div className="page-header__top">
            <div
              className="page-header__toggle"
              onClick={() => {
                setOpenDrawer(true);
              }}
            >
              ☰
            </div>
            <div className="page-header__logo">
              <span className="logo">
                <span onClick={() => navigate("/")}>
                  <FaReact className="rotate icon-react" />
                  BookStore
                </span>

                <VscSearchFuzzy className="icon-search" />
              </span>
              <input
                className="input-search"
                type={"text"}
                placeholder="Bạn tìm gì hôm nay"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                }}
              />
            </div>
          </div>
          <nav className="page-header__bottom">
            <ul id="navigation" className="navigation">
              <li className="navigation__item">
                {!isMobile ? (
                  <Popover
                    className="popover-carts"
                    placement="topRight"
                    rootClassName="popover-carts"
                    title={"Sản phẩm mới thêm"}
                    content={contentPopover}
                    arrow={true}
                  >
                    <Badge
                      // count={carts?.length ?? 0}
                      count={isAuthenticated ? carts?.length ?? 0 : 0}
                      size={"small"}
                      showZero
                    >
                      <FiShoppingCart className="icon-cart" />
                    </Badge>
                  </Popover>
                ) : (
                  <>
                    <Badge
                      // count={carts?.length ?? 0}
                      count={isAuthenticated ? carts?.length ?? 0 : 0}
                      size={"small"}
                      showZero
                    >
                      <FiShoppingCart
                        className="icon-cart"
                        onClick={() => nav("/order")}
                      />
                    </Badge>
                  </>
                )}
              </li>
              <li className="navigation__item mobile">
                <Divider type="vertical" />
              </li>
              <li className="navigation__item mobile">
                {!isAuthenticated ? (
                  <span onClick={() => navigate("/login")}> Tài Khoản</span>
                ) : (
                  <Dropdown menu={{ items }} trigger={["click"]}>
                    <Space>
                      <Avatar src={urlAvatar} />
                      {user?.fullName}
                    </Space>
                  </Dropdown>
                )}
              </li>
            </ul>
          </nav>
        </header>
      </div>
      <Drawer
        title="Menu chức năng"
        placement="left"
        onClose={() => setOpenDrawer(false)}
        open={openDrawer}
      >
        <p>Quản lý tài khoản</p>
        <Divider />

        <p onClick={() => handleLogout()}>Đăng xuất</p>
        <Divider />
      </Drawer>
      <ManageAccount
        isModalOpen={openModalAccount}
        setIsModalOpen={setOpenModalAccount}
      />
    </>
  );
};

export default AppHeader;
