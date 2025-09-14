import { App, Button, Col, Form, Input, Row } from "antd";
import { FormProps } from "antd/lib";
import { useCurrentApp } from "../context/app.context";
import { changePasswordAPI } from "@/services/api";

type FieldType = {
  email?: string;
  oldpass?: string;
  newpass?: string;
};
type UpdatePasswordAccountProps = {
  formUpdatePassword: FormProps<FieldType>["form"];
};
const UpdatePasswordAccount = (props: UpdatePasswordAccountProps) => {
  const { user } = useCurrentApp();
  const { formUpdatePassword } = props;
  const { message, notification } = App.useApp();

  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    console.log("values", values);

    // call api change password
    const res = await changePasswordAPI(
      values.email || "",
      values.oldpass || "",
      values.newpass || ""
    );

    if (res && res.data) {
      message.success("Đổi mật khẩu thành công!");
    } else {
      notification.error({
        message: "Đổi mật khẩu thất bại!",
        description: res?.message || "Có lỗi xảy ra!",
      });
      return;
    }
    localStorage.removeItem("access_token");
  };

  return (
    <Row className="p-5">
      <Col span={14}>
        <Form
          onFinish={onFinish}
          layout="vertical"
          autoComplete="off"
          form={formUpdatePassword}
        >
          <Form.Item<FieldType>
            label="Email"
            name="email"
            initialValue={user?.email}
          >
            <Input disabled />
          </Form.Item>

          <Form.Item<FieldType>
            label="Mật khẩu hiện tại"
            name="oldpass"
            initialValue={""}
            rules={[
              {
                required: true,
                message: "Mật khẩu hiện tại không được để trống!",
              },
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item<FieldType>
            label="Mật khẩu mới"
            name="newpass"
            initialValue={""}
            rules={[
              { required: true, message: "Mật khẩu mới không được để trống!" },
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item label={null}>
            <Button type="primary" variant="solid" htmlType="submit">
              Xác nhận
            </Button>
          </Form.Item>
        </Form>
      </Col>
    </Row>
  );
};

export default UpdatePasswordAccount;
