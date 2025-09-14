import { Avatar, Badge, Descriptions, DescriptionsProps, Drawer } from "antd";
import dayjs from "dayjs";

type IPropType = {
  open: boolean;
  setOpen: (v: boolean) => void;
  user: IUserTable | null;
  setUser: (v: IUserTable | null) => void;
};
const ViewUser = (props: IPropType) => {
  const { open, setOpen, user, setUser } = props;

  const onClose = () => {
    setOpen(false);
    setUser(null);
  };

  const items: DescriptionsProps["items"] = [
    {
      key: "1",
      label: "Id",
      children: user?._id,
      span: 1,
    },
    {
      key: "2",
      label: "Tên hiển thị",
      children: user?.fullName,
      span: 2,
    },
    {
      key: "3",
      label: "Email",
      children: user?.email,
      span: 1,
    },
    {
      key: "4",
      label: "Số điện thoại",
      children: user?.phone,
      span: 2,
    },
    {
      key: "5",
      label: "Status",
      children: <Badge status="processing" text={user?.role} />,
      span: 1,
    },
    {
      key: "5",
      label: "Avatar",
      children: (
        <Avatar
          size={40}
          src={`${import.meta.env.VITE_BACKEND_URL}/images/avatar/${
            user?.avatar
          }`}
        ></Avatar>
      ),
      span: 2,
    },
    {
      key: "7",
      label: "Created At",
      children: dayjs(user?.createdAt).format("DD-MM-YYYY"),
    },
    {
      key: "8",
      label: "Update At",
      children: dayjs(user?.updatedAt).format("DD-MM-YYYY"),
    },
  ];

  return (
    <>
      <Drawer
        title="Chức năng xem chi tiết"
        onClose={onClose}
        open={open}
        width={"50vw"}
      >
        <Descriptions title="Thông tin user" bordered items={items} />
      </Drawer>
    </>
  );
};

export default ViewUser;
