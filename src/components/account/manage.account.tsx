import { Col, Form, Modal, Row, Tabs, TabsProps, UploadFile } from "antd";
import { useState } from "react";
import UpdatePasswordAccount from "./manage.change.password.account";
import UpdateAccount from "./manage.update.account";

interface IManageAccountProps {
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
}
const ManageAccount = (props: IManageAccountProps) => {
  const { isModalOpen, setIsModalOpen } = props;
  const [activeKey, setActiveKey] = useState("1");
  const [fileAvatar, setFileAvatar] = useState<UploadFile | null>(null);
  const [formUpdateAccount] = Form.useForm();
  const [formUpdatePassword] = Form.useForm();

  const handleCancel = () => {
    setIsModalOpen(false);
    setFileAvatar(null);
    formUpdateAccount.resetFields();
    formUpdatePassword.resetFields();
  };

  const onChange = (key: string) => {
    setActiveKey(key);
  };

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "Cập nhật thông tin",
      children: (
        <UpdateAccount
          fileAvatar={fileAvatar}
          setFileAvatar={setFileAvatar}
          formUpdateAccount={formUpdateAccount}
        />
      ),
    },
    {
      key: "2",
      label: "Đổi mật khẩu",
      children: (
        <UpdatePasswordAccount formUpdatePassword={formUpdatePassword} />
      ),
    },
  ];

  return (
    <>
      <Modal
        title="Quản lý tài khoản"
        open={isModalOpen}
        onCancel={handleCancel}
        maskClosable={false}
        okButtonProps={{ style: { display: "none" } }}
        cancelButtonProps={{ style: { display: "none" } }}
        width={800}
      >
        <Row>
          <Col span={24}>
            <Tabs
              defaultActiveKey={activeKey}
              items={items}
              onChange={onChange}
            />
          </Col>
        </Row>
      </Modal>
    </>
  );
};

export default ManageAccount;
