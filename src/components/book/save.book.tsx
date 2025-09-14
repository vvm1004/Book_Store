import {
  createBookAPI,
  getCategoryBookAPI,
  updateBookAPI,
  uploadFileBookImg,
} from "@/services/api";
import { PlusOutlined } from "@ant-design/icons";
import { ActionType } from "@ant-design/pro-components";
import {
  App,
  Col,
  Form,
  FormProps,
  GetProp,
  Image,
  Input,
  InputNumber,
  Modal,
  Row,
  Select,
  Upload,
  UploadFile,
  UploadProps,
} from "antd";
import { BaseOptionType } from "antd/es/select";
import { RcFile } from "antd/lib/upload";
import { MutableRefObject, useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
type IPropType = {
  isModalOpen: boolean;
  setIsModalOpen: (v: boolean) => void;
  actionRef: MutableRefObject<ActionType | undefined>;
  book: IBookTable | null;
  setBook: (v: IBookTable | null) => void;
};
type FieldType = {
  thumbnail?: UploadFile[] | string;
  slider?: UploadFile[] | string[];
  mainText?: string;
  author?: string;
  price?: number;
  quantity?: number;
  category?: string;
};
type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];
const getBase64 = (file: FileType): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
const SaveBook = (props: IPropType) => {
  const { isModalOpen, setIsModalOpen, actionRef, book, setBook } = props;
  const [form] = Form.useForm();
  const { message, notification } = App.useApp();

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [fileThumbnail, setFileThumbnail] = useState<UploadFile[]>([]);

  const [previewSliderOpen, setPreviewSliderOpen] = useState(false);
  const [previewSliderImage, setPreviewSliderImage] = useState("");
  const [fileSlider, setFileSlider] = useState<UploadFile[]>([]);
  const [options, setOptions] = useState<BaseOptionType[]>([]);

  // fetch category
  useEffect(() => {
    const fetchCategoryBook = async () => {
      const res = await getCategoryBookAPI();
      if (res.data) {
        const data = res.data.map((item) => ({
          label: item,
          value: item,
        }));

        setOptions(data);
      }
    };

    fetchCategoryBook();
  }, []);

  // fetch data book
  useEffect(() => {
    if (book) {
      const baseUrl = import.meta.env.VITE_BACKEND_URL + "/images/book/";

      form.setFieldsValue({
        mainText: book.mainText,
        author: book.author,
        price: book.price,
        quantity: book.quantity,
        category: book.category,
        thumbnail: [
          {
            uid: uuidv4(),
            name: book.thumbnail,
            status: "done",
            url: baseUrl + book.thumbnail,
          },
        ],
        slider: book.slider?.map((item) => ({
          uid: uuidv4(),
          name: item,
          status: "done",
          url: baseUrl + item,
        })),
      });
    }
  }, [book, form]);

  const handleOk = () => {
    form.submit();
  };

  const handleCancel = () => {
    resetDataModal();
  };

  const onFinish: FormProps<FieldType>["onFinish"] = async (
    values: FieldType
  ) => {
    const { thumbnail, slider } = values;

    if (thumbnail && thumbnail.length > 0) {
      const dataUpload = thumbnail[0] as UploadFile;
      if (dataUpload.originFileObj) {
        const resThumbnail = await uploadFileBookImg(
          thumbnail[0] as UploadFile
        );
        if (resThumbnail.data) {
          values.thumbnail = resThumbnail.data.fileUploaded;
        } else {
          notification.error({
            message: "Có lỗi xảy ra",
            description: resThumbnail.message,
          });
          return;
        }
      } else {
        values.thumbnail = dataUpload.name;
      }
    }

    if (slider && slider.length > 0) {
      const sliderStr: string[] = [];
      for (const item of slider) {
        const dataUpload = item as UploadFile;
        if (dataUpload.originFileObj) {
          const resSlider = await uploadFileBookImg(item as UploadFile);
          if (resSlider.data) {
            sliderStr.push(resSlider.data.fileUploaded);
          } else {
            notification.error({
              message: "Có lỗi xảy ra",
              description: resSlider.message,
            });
            return;
          }
        } else {
          sliderStr.push(dataUpload.name);
        }
      }
      values.slider = sliderStr;
    }

    const bookData: IBookData = {
      thumbnail: values.thumbnail as string,
      slider: values.slider as string[],
      mainText: values.mainText,
      author: values.author,
      price: values.price,
      quantity: values.quantity,
      category: values.category,
    };

    if (!book) {
      // create book
      const resDataBook = await createBookAPI(bookData);

      if (resDataBook.data) {
        message.success("Tạo mới sách thành công");
        resetDataModal();
        actionRef.current?.reload();
      } else {
        notification.error({
          message: "Có lỗi xảy ra",
          description: resDataBook.message,
        });
      }
    } else {
      const resDataBook = await updateBookAPI(bookData, book._id);

      if (resDataBook.data) {
        message.success("Cập nhật sách thành công");
        resetDataModal();
        actionRef.current?.reload();
      } else {
        notification.error({
          message: "Có lỗi xảy ra",
          description: resDataBook.message,
        });
      }
    }
  };

  const resetDataModal = () => {
    form.resetFields();
    setIsModalOpen(false);
    setFileThumbnail([]);
    setPreviewImage("");
    setPreviewOpen(false);
    setFileSlider([]);
    setPreviewSliderImage("");
    setPreviewSliderOpen(false);
    setBook(null);
  };

  const beforeUpload = (file: RcFile) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      message.error("You can only upload JPG/PNG file!");
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("Image must smaller than 2MB!");
    }
    return (isJpgOrPng && isLt2M) || Upload.LIST_IGNORE;
  };

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as FileType);
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };

  const handleChange: UploadProps["onChange"] = (info) => {
    setFileThumbnail(info.fileList);
  };

  const updatePropThumbnail: UploadProps = {
    name: "thumbnail",
    listType: "picture-card",
    fileList: fileThumbnail,
    onPreview: handlePreview,
    onChange: handleChange,
    multiple: false,
    maxCount: 1,
    beforeUpload: beforeUpload,
    customRequest: ({ onSuccess }) => {
      if (onSuccess) {
        onSuccess("ok");
      }
    },
    accept: "image/*",
  };

  const handlePreviewSlider = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as FileType);
    }
    setPreviewSliderImage(file.url || (file.preview as string));
    setPreviewSliderOpen(true);
  };

  const handleChangeSlider: UploadProps["onChange"] = ({
    fileList: newFileList,
  }) => {
    setFileSlider(newFileList);
  };

  const updatePropSlider: UploadProps = {
    listType: "picture-card",
    fileList: fileSlider,
    onPreview: handlePreviewSlider,
    onChange: handleChangeSlider,
    multiple: true,
    beforeUpload: beforeUpload,
    customRequest: ({ onSuccess }) => {
      if (onSuccess) {
        onSuccess("ok");
      }
    },
    accept: "image/*",
  };

  const uploadButton = (
    <button style={{ border: 0, background: "none" }} type="button">
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  );

  const normFile = (e: { fileList: UploadFile[]; file: UploadFile }) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  return (
    <>
      <Modal
        title={book ? "Cập nhật sách" : "Thêm mới sách"}
        open={isModalOpen}
        onOk={handleOk}
        okText={book ? "Cập nhật" : "Tạo mới"}
        onCancel={handleCancel}
        cancelText="Hủy"
        width={"60vw"}
        maskClosable={false}
      >
        <Form name="basic" layout="vertical" onFinish={onFinish} form={form}>
          <Row gutter={15}>
            <Col span={12}>
              <Form.Item<FieldType>
                label="Tên sách"
                name="mainText"
                rules={[
                  { required: true, message: "Tên sách không được để trống" },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item<FieldType>
                label="Tác giả"
                name="author"
                rules={[
                  {
                    required: true,
                    message: "Tên tác giả không được để trống ",
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={15}>
            <Col span={12}>
              <Row gutter={12}>
                <Col span={12}>
                  <Form.Item<FieldType>
                    label="Giá tiền"
                    name="price"
                    rules={[
                      {
                        required: true,
                        message: "Giá tiền không được để trống",
                      },
                    ]}
                  >
                    <InputNumber
                      addonAfter="đ"
                      formatter={(value) => {
                        return `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                      }}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item<FieldType>
                    label="Thể loại"
                    name="category"
                    rules={[
                      {
                        required: true,
                        message: "Thể loại không được để trống",
                      },
                    ]}
                  >
                    <Select options={options} />
                  </Form.Item>
                </Col>
              </Row>
            </Col>

            <Col span={12}>
              <Form.Item<FieldType>
                label="Số lượng"
                name="quantity"
                rules={[
                  { required: true, message: "Số lượng không được để trống" },
                ]}
              >
                <InputNumber style={{ width: "150px" }} />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <Form.Item<FieldType>
                label="Ảnh thumbnail"
                name="thumbnail"
                rules={[
                  {
                    required: true,
                    message: "Ảnh Thumbnail không được để trống ",
                  },
                ]}
                valuePropName="fileList"
                getValueFromEvent={normFile}
              >
                <Upload {...updatePropThumbnail}>{uploadButton}</Upload>
              </Form.Item>
              {previewImage && (
                <Image
                  wrapperStyle={{ display: "none" }}
                  preview={{
                    visible: previewOpen,
                    onVisibleChange: (visible) => setPreviewOpen(visible),
                    afterOpenChange: (visible) =>
                      !visible && setPreviewImage(""),
                  }}
                  src={previewImage}
                />
              )}
            </Col>
            <Col span={12}>
              <Form.Item<FieldType>
                label="Ảnh slider"
                name="slider"
                rules={[
                  {
                    required: true,
                    message: "Ảnh Slider không được để trống ",
                  },
                ]}
                valuePropName="fileList"
                getValueFromEvent={normFile}
              >
                <Upload {...updatePropSlider}>{uploadButton}</Upload>
              </Form.Item>
              {previewSliderImage && (
                <Image
                  wrapperStyle={{ display: "none" }}
                  preview={{
                    visible: previewSliderOpen,
                    onVisibleChange: (visible) => setPreviewSliderOpen(visible),
                    afterOpenChange: (visible) =>
                      !visible && setPreviewSliderImage(""),
                  }}
                  src={previewSliderImage}
                />
              )}
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
};

export default SaveBook;
