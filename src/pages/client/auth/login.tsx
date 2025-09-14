import { useCurrentApp } from "@/components/context/app.context";
import { loginAPI } from "@/services/api";
import { App, Button, Divider, Form, FormProps, Input } from "antd";
import Title from "antd/es/typography/Title";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

type FieldType = {
  email?: string;
  password?: string;
};

const LoginPage = () => {
  const [form] = Form.useForm();
  const { notification, message } = App.useApp();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setIsAuthenticated, setUser } = useCurrentApp();

  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    setLoading(true);
    const res = await loginAPI(values.email || "", values.password || "");
    if (res.data) {
      setIsAuthenticated(true);
      setUser(res.data.user);
      localStorage.setItem("access_token", res.data.access_token);
      message.success("Đăng nhập tài khoản thành công");
      navigate("/");
    } else {
      notification.error({
        message: "Có lỗi xảy ra",
        description: res.message,
      });
    }
    setLoading(false);
  };

  return (
    <div className="bg-gray-300 h-[100vh] sm:h-[100vw] flex justify-center pt-10">
      <Form
        name="basic"
        layout="vertical"
        className="w-[400px] h-[50%] sm:h-[32%] bg-white p-5 rounded-lg shadow-lg"
        onFinish={onFinish}
        form={form}
      >
        <Title level={2} style={{ textAlign: "left" }}>
          Đăng nhập
          <Divider />
        </Title>

        <Form.Item<FieldType>
          label="Email"
          name="email"
          rules={[
            { required: true, message: "Email không được để trống" },
            { type: "email", message: "Email không đúng định dạng" },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item<FieldType>
          label="Mật khẩu"
          name="password"
          rules={[{ required: true, message: "Mật khẩu không được để trống " }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item label={null}>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            className="w-full mt-2"
          >
            Đăng nhập
          </Button>
        </Form.Item>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Divider>Or</Divider>
          <p>
            Chưa có tài khoản ? <Link to="/register">Đăng ký</Link>
          </p>
        </div>
      </Form>
    </div>
  );
};

export default LoginPage;
