import { updateInfoAPI, uploadFileAvatarImg } from "@/services/api";
import { UploadOutlined } from "@ant-design/icons";
import {
  App,
  Avatar,
  Button,
  Col,
  Form,
  FormProps,
  Input,
  Row,
  Upload,
  UploadFile,
  UploadProps,
} from "antd";
import { useCurrentApp } from "../context/app.context";

interface IUpdateAccountProps {
  fileAvatar: UploadFile | null;
  setFileAvatar: (file: UploadFile | null) => void;
  formUpdateAccount: FormProps<FieldType>["form"];
}
type FieldType = {
  email?: string;
  fullName?: string;
  phone?: string;
};
const UpdateAccount = (props: IUpdateAccountProps) => {
  const { message, notification } = App.useApp();

  const { fileAvatar, setFileAvatar, formUpdateAccount } = props;

  const { user, setUser } = useCurrentApp();

  const uploadProps: UploadProps = {
    name: "file",
    maxCount: 1,
    multiple: false,
    accept: ".png, .jpg, .jpeg",
    headers: {
      authorization: "authorization-text",
    },
    customRequest: ({ file, onSuccess }) => {
      if (onSuccess) {
        onSuccess("ok", file);
      }
    },
    onChange(info) {
      if (info.file.status === "done") {
        if (info.file.originFileObj) {
          setFileAvatar(info.file);
        }
      } else if (info.file.status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    showUploadList: false,
  };

  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    // upload avatar
    let avatarStr = user?.avatar;
    if (fileAvatar && fileAvatar.originFileObj) {
      const resUpload = await uploadFileAvatarImg(fileAvatar);

      if (resUpload.data) {
        avatarStr = resUpload.data.fileUploaded;
      } else {
        notification.error({
          message: "Có lỗi xảy ra",
          description: JSON.stringify(resUpload.error),
        });
        return;
      }
    }

    // update info
    if (user) {
      const res = await updateInfoAPI(
        user.id,
        values.fullName || "",
        values.phone || "",
        avatarStr || ""
      );

      if (res.data) {
        message.success("Cập nhật thông tin thành công");
      } else {
        notification.error({
          message: "Có lỗi xảy ra",
          description: JSON.stringify(res.error),
        });
        return;
      }
      setUser({
        ...user,
        fullName: values.fullName || "",
        phone: values.phone || "",
        avatar: avatarStr || "",
      });
      localStorage.removeItem("access_token");
    }
  };

  return (
    <Row className="p-2">
      <Col span={10} className="flex flex-col space-y-3">
        {fileAvatar && fileAvatar.originFileObj ? (
          <Avatar
            src={URL.createObjectURL(fileAvatar.originFileObj)}
            size={150}
          />
        ) : (
          <Avatar
            src={
              import.meta.env.VITE_BACKEND_URL +
              "/images/avatar/" +
              user?.avatar
            }
            size={150}
          />
        )}
        <Upload {...uploadProps}>
          <Button icon={<UploadOutlined />}>Upload Avatar</Button>
        </Upload>
      </Col>
      <Col style={{ flex: 1 }}>
        <Form
          onFinish={onFinish}
          layout="vertical"
          autoComplete="off"
          form={formUpdateAccount}
        >
          <Form.Item<FieldType>
            label="Email"
            name="email"
            initialValue={user?.email}
          >
            <Input disabled />
          </Form.Item>

          <Form.Item<FieldType>
            label="Tên hiển thị"
            name="fullName"
            initialValue={user?.fullName}
            rules={[
              { required: true, message: "Tên hiển thị không được để trống!" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item<FieldType>
            label="Số điện hoại"
            name="phone"
            initialValue={user?.phone}
            rules={[
              { required: true, message: "Số điện thoại không được để trống!" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item label={null}>
            <Button htmlType="submit">Cập nhật</Button>
          </Form.Item>
        </Form>
      </Col>
    </Row>
  );
};

export default UpdateAccount;
