import { bulkCreateUsersAPI } from "@/services/api";
import { InboxOutlined } from "@ant-design/icons";
import { ActionType } from "@ant-design/pro-components";
import { App, Modal, Table, UploadProps } from "antd";
import Title from "antd/es/typography/Title";
import Dragger from "antd/es/upload/Dragger";
import ExcelJS from "exceljs";
import { MutableRefObject, useState } from "react";
import templateFile from "assets/template/users.xlsx?url";
type IPropType = {
  isModalUploadOpen: boolean;
  setIsModalUploadOpen: (v: boolean) => void;
  actionRef: MutableRefObject<ActionType | undefined>;
};
const columns = [
  {
    title: "Tên hiển thị",
    dataIndex: "fullName",
    key: "fullName",
  },
  {
    title: "Email",
    dataIndex: "email",
    key: "email",
  },
  {
    title: "Số điện thoại",
    dataIndex: "phone",
    key: "phone",
  },
];
const UploadFileUser = (props: IPropType) => {
  const { isModalUploadOpen, setIsModalUploadOpen, actionRef } = props;

  const [dataSource, setDataSource] = useState<IBulkCreateUserRequest[]>([]);

  const { message, notification } = App.useApp();

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const getFileUrl = () => {
    return new URL(templateFile, import.meta.url).href;
  };

  const handleOk = async () => {
    setIsLoading(true);
    const res = await bulkCreateUsersAPI(dataSource);

    if (res.data) {
      notification.success({
        message: "Bulk Create Users",
        description: `Success = ${res.data.countSuccess}. Error = ${res.data.countError}`,
      });
      setIsModalUploadOpen(false);
      setDataSource([]);
      setIsLoading(false);
      actionRef.current?.reload();
    } else {
      notification.error({
        message: "Bulk Create Users",
        description: res.message,
      });
    }
    setIsLoading(false);
  };

  const handleCancel = () => {
    setIsModalUploadOpen(false);
    setDataSource([]);
  };

  const propsUpload: UploadProps = {
    name: "file",
    multiple: false,
    maxCount: 1,
    accept: ".csv,.xls,.xlsx",
    customRequest: ({ file, onSuccess }) => {
      const reader = new FileReader();
      const workbook = new ExcelJS.Workbook();
      reader.onload = async (e) => {
        const fileBuffer = e.target?.result;
        await workbook.xlsx.load(fileBuffer as ArrayBuffer);
        setDataSource([]);
        workbook.eachSheet((worksheet) => {
          worksheet.eachRow((row, rowNumber) => {
            if (rowNumber > 1) {
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              const [_, fullName, email, phone] = Array.isArray(row.values)
                ? row.values
                : [];
              setDataSource((prev) => [
                ...prev,
                {
                  fullName: fullName?.toString() || "",
                  email: email?.toString() || "",
                  phone: phone?.toString() || "",
                  password: `${
                    import.meta.env.VITE_USER_CREATE_DEFAULT_PASSWORD
                  }`,
                  id: rowNumber,
                },
              ]);
            }
          });
        });
      };
      reader.readAsArrayBuffer(file as Blob);

      if (onSuccess) {
        onSuccess("ok");
      }
    },
    onChange(info) {
      const { status } = info.file;
      console.log("info", info);
      if (status !== "uploading") {
        console.log(info.file, info.fileList);
      }
      if (status === "done") {
        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    onDrop(e) {
      console.log("Dropped files", e.dataTransfer.files);
    },
  };

  return (
    <>
      <Modal
        title={<Title level={5}>Import data user</Title>}
        open={isModalUploadOpen}
        onOk={handleOk}
        okButtonProps={{
          disabled: dataSource.length === 0,
          loading: isLoading,
        }}
        okText={"Import data"}
        onCancel={handleCancel}
        width={"50vw"}
        destroyOnClose={isModalUploadOpen}
      >
        <>
          <Dragger {...propsUpload}>
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>

            <p className="ant-upload-hint">
              Support for a single upload. Only accept .csv, .xls, .xlsx or{" "}
              <a
                target="_blank"
                download
                href={getFileUrl()}
                onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                  //   e.preventDefault(); // Ngừng hành động mặc định (ví dụ: mở popup)
                  e.stopPropagation(); // Ngừng sự kiện lan truyền
                }}
              >
                Download Sample File
              </a>
            </p>
          </Dragger>
          <Table
            title={() => "Dữ liệu upload:"}
            dataSource={dataSource}
            columns={columns}
            rowKey={"id"}
          />
        </>
      </Modal>
    </>
  );
};

export default UploadFileUser;
