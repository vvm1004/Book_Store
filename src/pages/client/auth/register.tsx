import { registerAPI } from "@/services/api";
import { App, Button, Divider, Form, FormProps, Input } from "antd";
import Title from "antd/es/typography/Title";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

type FieldType = {
  fullName?: string;
  email?: string;
  password?: string;
  phone?: string;
};

const RegisterPage = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const { message } = App.useApp();
  const navigate = useNavigate();

  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    setLoading(true);
    const res = await registerAPI(
      values.fullName || "",
      values.email || "",
      values.password || "",
      values.phone || ""
    );
    if (res.data) {
      form.resetFields();
      message.success("Đăng ký user thành công");
      navigate("/login");
    } else {
      message.error(res.message);
    }

    setLoading(false);
  };

  const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (
    errorInfo
  ) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div className="bg-gray-300 h-[100vh] sm:h-[100vw] flex justify-center  pt-10">
      <Form
        name="basic"
        layout="vertical"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        className="w-[400px] h-[70%] sm:h-[45%]  bg-white p-5 rounded-lg shadow-lg"
        form={form}
      >
        <Title level={2} style={{ textAlign: "left" }}>
          Đăng ký tài khoản
          <Divider />
        </Title>
        <Form.Item<FieldType>
          label="Họ tên"
          name="fullName"
          rules={[{ required: true, message: "Họ tên không được để trống" }]}
        >
          <Input />
        </Form.Item>

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

        <Form.Item<FieldType>
          label="Số điện thoại"
          name="phone"
          rules={[
            { required: true, message: "Số điện thoại không được để trống" },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item label={null}>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            className="w-full"
          >
            Đăng ký
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
            Đã có tài khoản ? <Link to="/login">Đăng nhập</Link>
          </p>
        </div>
      </Form>
    </div>
  );
};

export default RegisterPage;
