import { updateUsersAPI } from "@/services/api";
import { ActionType } from "@ant-design/pro-components";
import { App, Divider, Form, Input, Modal } from "antd";
import { FormProps } from "antd/lib";
import { MutableRefObject, useEffect } from "react";

type IPropType = {
  isModalOpen: boolean;
  setIsModalOpen: (v: boolean) => void;
  actionRef: MutableRefObject<ActionType | undefined>;
  user: IUserTable | null;
  setUser: (v: IUserTable | null) => void;
};
type FieldType = {
  fullName?: string;
  email?: string;
  password?: string;
  phone?: string;
};
const UpdateUser = (props: IPropType) => {
  const { isModalOpen, setIsModalOpen, actionRef, user, setUser } = props;
  const [form] = Form.useForm();
  const { notification, message } = App.useApp();

  useEffect(() => {
    if (user) {
      form.setFieldsValue({
        email: user.email,
        fullName: user.fullName,
        phone: user.phone,
      });
    }
  }, [user, form]);

  const handleCancel = () => {
    setUser(null);
    setIsModalOpen(false);
    form.resetFields();
  };

  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    console.log("values", values);
    const res = await updateUsersAPI(
      user?._id || "",
      values.fullName || "",
      values.phone || ""
    );
    if (res.data) {
      form.resetFields();
      setIsModalOpen(false);
      setUser(null);
      actionRef.current?.reload();
      message.success("cập nhật user thành công");
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
        title="Cập nhật người dùng"
        open={isModalOpen}
        onOk={() => form.submit()}
        onCancel={handleCancel}
        cancelText="Hủy"
        okText="Cập nhật"
        maskClosable={false}
      >
        <Form name="basic" layout="vertical" onFinish={onFinish} form={form}>
          <Divider />

          <Form.Item<FieldType>
            label="Email"
            name="email"
            labelCol={{ span: 24 }}
          >
            <Input disabled />
          </Form.Item>

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

export default UpdateUser;
