import { deleteBookAPI } from "@/services/api";
import { DeleteOutlined } from "@ant-design/icons";
import { ActionType } from "@ant-design/pro-components";
import { App, Popconfirm, PopconfirmProps } from "antd";
import { MutableRefObject } from "react";

type IPropType = {
  actionRef: MutableRefObject<ActionType | undefined>;
  id: string;
};
const DeleteBook = (props: IPropType) => {
  const { actionRef, id } = props;
  const { message, notification } = App.useApp();
  const confirm: PopconfirmProps["onConfirm"] = async () => {
    const res = await deleteBookAPI(id);

    if (res.data) {
      actionRef.current?.reload();
      message.success("Xoá sách thành công");
    } else {
      notification.error({
        message: "Có lỗi xảy ra",
        description: res.message,
      });
    }
  };

  const cancel: PopconfirmProps["onCancel"] = (e) => {
    console.log(e);
  };
  return (
    <Popconfirm
      title="Xác nhận xoá book"
      description="Bạn có chắc muốn xoá sách này"
      onConfirm={confirm}
      onCancel={cancel}
      okText="Yes"
      cancelText="No"
    >
      <DeleteOutlined
        style={{ cursor: "pointer", color: "red" }}
        onClick={() => {}}
      />
    </Popconfirm>
  );
};

export default DeleteBook;
