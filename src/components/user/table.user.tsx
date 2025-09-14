import { dateRangeValidate } from "@/helper/date.helper";
import { getUsersAPI } from "@/services/api";
import {
  CloudUploadOutlined,
  EditOutlined,
  ExportOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import type { ActionType, ProColumns } from "@ant-design/pro-components";
import { ProTable } from "@ant-design/pro-components";
import { Button } from "antd";
import dayjs from "dayjs";
import { useRef, useState } from "react";
import { CSVLink } from "react-csv";
import CreateUser from "./create.user";
import DeleteUser from "./delete.user";
import UpdateUser from "./update.user";
import UploadFileUser from "./upload.user";
import ViewUser from "./view.user";

type FieldTypeSort = {
  email?: string;
  fullName?: string;
  createdAt?: string;
};

const TableUser = () => {
  const columns: ProColumns<IUserTable>[] = [
    {
      dataIndex: "index",
      valueType: "indexBorder",
      width: 48,
    },
    {
      title: "Id",
      dataIndex: "_id",
      render: (index, record) => {
        return (
          <a
            href="#"
            onClick={() => {
              setOpenView(true);
              setUser(record);
            }}
          >
            {record._id}
          </a>
        );
      },
      search: false,
    },
    { title: "Full Name", dataIndex: "fullName", sorter: true },
    { title: "Email", dataIndex: "email", copyable: true, sorter: true },
    {
      title: "Created At",
      dataIndex: "createdAt",
      valueType: "dateRange",
      sorter: true,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      render(dom, entity, index, action, schema) {
        return <span>{dayjs(entity?.createdAt).format("YYYY-MM-DD")}</span>;
      },
    },
    {
      title: "Action",
      search: false,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      render(dom, entity, index, action, schema) {
        return (
          <div style={{ display: "flex", gap: "15px" }}>
            <EditOutlined
              style={{ cursor: "pointer", color: "orange" }}
              onClick={() => {
                setIsModalUpdateOpen(true);
                setUser(entity);
              }}
            />

            <DeleteUser _id={entity._id} actionRef={actionRef} />
          </div>
        );
      },
    },
  ];

  const actionRef = useRef<ActionType>();
  const [pageSize, setPageSize] = useState<number>(5);
  const [openView, setOpenView] = useState<boolean>(false);
  const [user, setUser] = useState<IUserTable | null>(null);
  const [users, setUsers] = useState<IUserTable[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isModalUpdateOpen, setIsModalUpdateOpen] = useState<boolean>(false);
  const [isModalUploadOpen, setIsModalUploadOpen] = useState<boolean>(false);

  const handleSort = (sort: FieldTypeSort) => {
    const { email, fullName, createdAt } = sort;

    let sortQuery = "";

    if (email) {
      sortQuery += (email === "ascend" ? "&sort=email" : "&sort=-email") + ",";
    }

    if (fullName) {
      sortQuery +=
        (fullName === "ascend" ? "&sort=fullName" : "&sort=-fullName") + ",";
    }

    if (createdAt) {
      sortQuery +=
        (createdAt === "ascend" ? "&sort=createdAt" : "&sort=-createdAt") + ",";
    }

    if (sortQuery.length > 0) {
      sortQuery = sortQuery.slice(0, -1);
    } else {
      sortQuery = "&sort=-createdAt";
    }

    return sortQuery;
  };

  return (
    <>
      <ProTable<IUserTable>
        columns={columns}
        actionRef={actionRef}
        cardBordered
        rowKey="_id"
        request={async (params, sort) => {
          const { current, fullName, email, createdAt } = params; // destructuring params
          let query = "";
          const sortQuery = handleSort(sort);

          if (pageSize !== params.pageSize) {
            setPageSize(params.pageSize || 5);
          }

          if (fullName) {
            query += `&fullName=/${fullName}/i`;
          }

          if (email) {
            query += `&email=/${email}/i`;
          }

          if (createdAt) {
            const dateRange = dateRangeValidate(createdAt);
            if (dateRange) {
              query += `&createdAt>=${dateRange[0]}&createdAt<=${dateRange[1]}`;
            }
          }
          const res = await getUsersAPI(
            current || 1,
            params.pageSize || 5,
            query,
            sortQuery
          );
          setUsers(res.data?.result || []);
          return {
            data: res.data?.result,
            success: true,
            total: res.data?.meta.total,
            pageSize: res.data?.meta.pageSize,
            page: res.data?.meta.current,
          };
        }}
        pagination={{
          pageSize: pageSize,
          showSizeChanger: true,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} trên ${total} rows`,
        }}
        dateFormatter="string"
        headerTitle="Table user"
        toolBarRender={() => [
          <CSVLink data={users} filename="user-export.csv">
            <Button key="button" icon={<ExportOutlined />} type="primary">
              Export
            </Button>
          </CSVLink>,
          <Button
            key="button"
            icon={<CloudUploadOutlined />}
            onClick={() => {
              setIsModalUploadOpen(true);
            }}
            type="primary"
          >
            Import
          </Button>,
          <Button
            key="button"
            icon={<PlusOutlined />}
            onClick={() => {
              actionRef.current?.reload();
              setIsModalOpen(true);
            }}
            type="primary"
          >
            Add new
          </Button>,
        ]}
      />
      <ViewUser
        open={openView}
        setOpen={setOpenView}
        user={user}
        setUser={setUser}
      />
      <CreateUser
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        actionRef={actionRef}
      />
      <UpdateUser
        isModalOpen={isModalUpdateOpen}
        setIsModalOpen={setIsModalUpdateOpen}
        actionRef={actionRef}
        user={user}
        setUser={setUser}
      />
      <UploadFileUser
        isModalUploadOpen={isModalUploadOpen}
        setIsModalUploadOpen={setIsModalUploadOpen}
        actionRef={actionRef}
      />
    </>
  );
};

export default TableUser;
