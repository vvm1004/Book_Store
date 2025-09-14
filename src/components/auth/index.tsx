import { Button, Result } from "antd";
import { Link, useLocation } from "react-router-dom";
import { useCurrentApp } from "../context/app.context";

interface IProps {
  children: React.ReactNode;
}
const ProtectedRoute = (props: IProps) => {
  const { isAuthenticated, user } = useCurrentApp();
  const location = useLocation();
  if (!isAuthenticated) {
    return (
      <Result
        status="404"
        title="Not Login"
        subTitle="Bạn vui lòng đăng nhập để sử dụng tính năng này"
        extra={
          <Button type="primary">
            <Link to="/login">Đăng nhập</Link>
          </Button>
        }
      />
    );
  }

  const isAdminRoute = location.pathname.includes("/admin");
  if (isAuthenticated && isAdminRoute) {
    const role = user?.role;
    if (role === "USER") {
      return (
        <Result
          status="403"
          title="403"
          subTitle="Sorry, you are not authorized to access this page."
          extra={
            <Button type="primary">
              <Link to="/">Back Home</Link>
            </Button>
          }
        />
      );
    }
  }

  return <>{props.children}</>;
};

export default ProtectedRoute;
