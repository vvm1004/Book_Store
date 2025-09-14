import { deleteUsersAPI } from "@/services/api";
import { DeleteOutlined } from "@ant-design/icons";
import { ActionType } from "@ant-design/pro-components";
import { App, Popconfirm, PopconfirmProps } from "antd";
import { MutableRefObject, useState } from "react";

type IPropType = {
  _id: string;
  actionRef: MutableRefObject<ActionType | undefined>;
};
const DeleteUser = (props: IPropType) => {
  const { _id, actionRef } = props;
  const { notification, message } = App.useApp();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const confirm: PopconfirmProps["onConfirm"] = async () => {
    setIsLoading(true);
    const res = await deleteUsersAPI(_id);
    if (res.data) {
      message.success("Xoá user thành công");
      actionRef.current?.reload();
    } else {
      notification.error({
        message: "Có lỗi xảy ra",
        description: res.message,
      });
    }
    setIsLoading(false);
  };

  return (
    <Popconfirm
      title="Xác nhận xoá user"
      description="Bạn có chắc chắn muốn xoá user này không ?"
      onConfirm={confirm}
      okText="Xác nhận"
      cancelText="Hủy"
      okButtonProps={{ loading: isLoading }}
    >
      <DeleteOutlined style={{ cursor: "pointer", color: "#ff4d4f" }} />
    </Popconfirm>
  );
};

export default DeleteUser;
