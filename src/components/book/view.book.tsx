import {
  Badge,
  Descriptions,
  DescriptionsProps,
  Divider,
  Drawer,
  GetProp,
  Image,
  Upload,
  UploadFile,
  UploadProps,
} from "antd";
import dayjs from "dayjs";
import { useCallback, useEffect, useMemo, useState } from "react";
import { v4 as uuidv4 } from "uuid";

type IPropType = {
  open: boolean;
  setOpen: (v: boolean) => void;
  book: IBookTable | null;
  setBook: (v: IBookTable | null) => void;
};
type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

const getBase64 = (file: FileType): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file as Blob);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
const ViewBook = (props: IPropType) => {
  const { open, setOpen, book, setBook } = props;
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const items: DescriptionsProps["items"] = useMemo(() => {
    return [
      {
        key: "1",
        label: "Id",
        children: book?._id,
        span: 1,
      },
      {
        key: "2",
        label: "Tên sách",
        children: book?.mainText,
        span: 2,
      },
      {
        key: "3",
        label: "Tác giả",
        children: book?.author,
        span: 1,
      },
      {
        key: "4",
        label: "Giá tiền",
        children: (
          <>
            {new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
            }).format(book?.price || 0)}
          </>
        ),

        span: 2,
      },
      {
        key: "5",
        label: "Thể loại",
        children: <Badge status="processing" text={book?.category} />,
        span: 3,
      },
      {
        key: "7",
        label: "Created At",
        children: dayjs(book?.createdAt).format("DD-MM-YYYY"),
      },
      {
        key: "8",
        label: "Update At",
        children: dayjs(book?.updatedAt).format("DD-MM-YYYY"),
      },
    ];
  }, [book]);

  const onClose = () => {
    setOpen(false);
    setBook(null);
    setFileList([]);
    setPreviewOpen(false);
    setPreviewImage("");
  };

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as FileType);
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };

  const handleChange: UploadProps["onChange"] = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const handleImageBook = useCallback(() => {
    if (book) {
      const { thumbnail, slider } = book;
      const baseUrl = import.meta.env.VITE_BACKEND_URL + "/images/book/";
      const uploadFileList: UploadFile[] = [];
      if (thumbnail) {
        uploadFileList.push({
          uid: uuidv4(),
          name: "image.png",
          status: "done",
          url: baseUrl + thumbnail,
        });
      }

      if (slider && slider.length > 0) {
        const newFileList: UploadFile[] = slider.map((sliderData: string) => ({
          uid: uuidv4(),
          name: "image.png",
          status: "done" as UploadFile["status"],
          url: baseUrl + sliderData,
        }));
        uploadFileList.push(...newFileList);
      }
      setFileList([...uploadFileList]);
    }
  }, [book]);

  useEffect(() => {
    handleImageBook();
  }, [handleImageBook]);

  return (
    <>
      <Drawer
        title="Chức năng xem chi tiết"
        onClose={onClose}
        open={open}
        width={"60vw"}
      >
        <Descriptions title="Thông tin Book" bordered items={items} />
        <div style={{ marginTop: "20px" }}>
          <Divider orientation="left">Ảnh books</Divider>
          <Upload
            action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
            listType="picture-card"
            fileList={fileList}
            onPreview={handlePreview}
            onChange={handleChange}
            showUploadList={{ showRemoveIcon: false }}
          />
          {previewImage && (
            <Image
              wrapperStyle={{ display: "none" }}
              preview={{
                visible: previewOpen,
                onVisibleChange: (visible) => setPreviewOpen(visible),
                afterOpenChange: (visible) => !visible && setPreviewImage(""),
              }}
              src={previewImage}
            />
          )}
        </div>
      </Drawer>
    </>
  );
};

export default ViewBook;
