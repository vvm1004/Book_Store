import { createUsersAPI } from "@/services/api";
import { ActionType } from "@ant-design/pro-components";
import { App, Divider, Form, Input, Modal } from "antd";
import { FormProps } from "antd/lib";
import { MutableRefObject } from "react";

type IPropType = {
  isModalOpen: boolean;
  setIsModalOpen: (v: boolean) => void;
  actionRef: MutableRefObject<ActionType | undefined>;
};
type FieldType = {
  fullName?: string;
  email?: string;
  password?: string;
  phone?: string;
};
const CreateUser = (props: IPropType) => {
  const { isModalOpen, setIsModalOpen, actionRef } = props;
  const [form] = Form.useForm();
  const { notification, message } = App.useApp();

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    console.log("values", values);
    const res = await createUsersAPI(
      values.fullName || "",
      values.password || "",
      values.email || "",
      values.phone || ""
    );
    if (res.data) {
      form.resetFields();
      setIsModalOpen(false);
      actionRef.current?.reload();
      message.success("tạo mới user thành công");
    } else {
      notification.error({
        message: "Có lỗi xảy ra",
        description: res.message,
      });
    }
  };

  return (
    <>
      <Modal
        title="Thêm mới người dùng"
        open={isModalOpen}
        onOk={() => form.submit()}
        onCancel={handleCancel}
        cancelText="Hủy"
        okText="Tạo mới"
        maskClosable={false}
      >
        <Form name="basic" layout="vertical" onFinish={onFinish} form={form}>
          <Divider />
          <Form.Item<FieldType>
            label="Tên hiển thị"
            name="fullName"
            labelCol={{ span: 24 }}
            rules={[
              { required: true, message: "Tên hiển thị không được để trống" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item<FieldType>
            label="Password"
            name="password"
            labelCol={{ span: 24 }}
            rules={[
              { required: true, message: "Password không được để trống " },
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item<FieldType>
            label="Email"
            name="email"
            labelCol={{ span: 24 }}
            rules={[
              { required: true, message: "Email không được để trống" },
              { type: "email", message: "Email không đúng định dạng" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item<FieldType>
            label="Số điện thoại"
            name="phone"
            labelCol={{ span: 24 }}
            rules={[
              { required: true, message: "Số điện thoại không được để trống" },
            ]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default CreateUser;
