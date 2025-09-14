import { ShoppingCartOutlined } from "@ant-design/icons";
import { App, Col, Form, InputNumber, Rate, Row } from "antd";
import { useForm } from "antd/es/form/Form";
import { useEffect, useRef, useState } from "react";
import ImageGallery from "react-image-gallery";
import ModalDetailBook from "./modal.detai.book";
import { FormProps } from "antd/lib";
import { saveBookLocalStorage } from "@/services/book.service";
import { useCurrentApp } from "../context/app.context";
import { useNavigate } from "react-router-dom";

interface IPropType {
  book: IBookTable | undefined;
}
interface ImageData {
  original: string;
  thumbnail: string;
}
interface FieldType {
  quantity?: number;
}
const BookDetail = (props: IPropType) => {
  const { book } = props;
  const [form] = useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { setCarts, isAuthenticated } = useCurrentApp();
  const { message } = App.useApp();
  const refGallery = useRef<ImageGallery>(null);
  const [images, setImages] = useState<ImageData[]>([]);
  const nav = useNavigate();

  useEffect(() => {
    if (book) {
      const imagesData: ImageData[] = [];
      const baseUrl = import.meta.env.VITE_BACKEND_URL + "/images/book/";
      const thumbnail = baseUrl + book.thumbnail;
      imagesData.push({
        original: thumbnail,
        thumbnail: thumbnail,
      });

      if (book.slider && book.slider.length > 0) {
        book.slider.forEach((img) => {
          imagesData.push({
            original: baseUrl + img,
            thumbnail: baseUrl + img,
          });
        });
      }
      setImages([...imagesData]);
    }
  }, [book]);

  const handleChangeValue = (value: number) => {
    const quantity = form.getFieldValue("quantity");

    if (quantity === 1 && value === -1) return;

    if (quantity === 1000 && value === 1) return;

    form.setFieldsValue({
      quantity: form.getFieldValue("quantity") + value,
    });
  };

  const onFinish: FormProps<FieldType>["onFinish"] = async (
    values: FieldType
  ) => {
    if (book && values.quantity) {
      const carts: ICartData[] = saveBookLocalStorage(book, values.quantity);
      setCarts([...carts]);
      message.success("Thêm sản phẩm vào giỏ hàng thành công");
    }
  };

  const handleBuyNow = (isBuyNow: boolean) => {
    if (!isAuthenticated) {
      message.error("Vui lòng đăng nhập để mua hàng");
      return;
    }

    form.submit();
    if (isBuyNow) {
      nav("/order");
    }
  };

  return (
    <>
      <Row gutter={20}>
        {/* Image */}
        <Col xs={0} xl={8}>
          <div className="cursor-pointer">
            <ImageGallery
              ref={refGallery}
              items={images}
              showFullscreenButton={false}
              showPlayButton={false}
              showNav={false}
              onClick={() => {
                setIsModalOpen(true);
              }}
            />
          </div>
        </Col>
        <Col xs={24} xl={0}>
          <ImageGallery
            items={images}
            showFullscreenButton={false}
            showPlayButton={false}
            showNav={false}
            showThumbnails={false}
          />
        </Col>
        <Col xl={16}>
          <Form name="basic" onFinish={onFinish} form={form}>
            <div className="flex flex-col space-y-5 mt-10 sm:mt-0">
              <div className="flex space-x-1">
                <p className="text-sm font-normal">Tác giả: </p>
                <span className="text-sm text-blue-400">{book?.author}</span>
              </div>
              <p className="text-[24px] text-[#676666] font-[150] capitalize">
                {book?.mainText}
              </p>
              <div className="flex items-center space-x-3 font-[100]">
                <Rate defaultValue={5} disabled className="text-sm" />
                <span className="text-[15px]">Đã bán {book?.sold}</span>
              </div>
              <div className="bg-gray-100 h-20 flex items-center ">
                <p className="ml-5 text-[30px] text-orange-600 font-semibold">
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(book?.price ?? 0)}
                </p>
              </div>
              <div className="flex space-x-10">
                <p className="text-[#676666] font-normal text-[13px]">
                  Vận chuyển
                </p>
                <p className="text-[13px]">Miễn phí vận chuyển</p>
              </div>
              <div className="flex item-center  space-x-5 w-full">
                <p className="flex items-center justify-center text-[#676666] font-normal ">
                  Số lượng
                </p>
                <div className="flex  justify-center items-center">
                  <span
                    onClick={() => handleChangeValue(-1)}
                    className="flex justify-center items-center text-lg  border-solid rounded-sm border-gray-200 w-[30px] h-[23px] cursor-pointer hover:bg-gray-100"
                  >
                    -
                  </span>
                  <div>
                    <Form.Item<FieldType>
                      name="quantity"
                      noStyle={true}
                      initialValue={1}
                    >
                      {/* <input className="flex justify-center items-center border-solid  border-gray-100 w-[40px] h-[20px] text-center" /> */}
                      <InputNumber
                        type="number"
                        min={1}
                        max={1000}
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          borderStyle: "solid",
                          borderColor: "#d9d9d9",
                          borderRadius: "0px",
                          textAlign: "center",
                          height: "25px",
                          width: "60px",
                          textAlignLast: "center",
                        }}
                        controls={false}
                      />
                    </Form.Item>
                  </div>
                  <span
                    onClick={() => handleChangeValue(1)}
                    className="flex justify-center items-center border-solid rounded-sm border-gray-200 w-[30px] cursor-pointer hover:bg-gray-100"
                  >
                    +
                  </span>
                </div>
              </div>
              <div className="flex space-x-5">
                <div
                  onClick={() => handleBuyNow(false)}
                  className="px-3 cursor-pointer hover:bg-orange-100 flex justify-center items-center space-x-2 h-[40px] bg-[#ff57221a;] border-[#ee4d2d] border-solid rounded-sm"
                >
                  <ShoppingCartOutlined className=" text-orange-600" />
                  <span className="text-[13px] text-[#ee4d2d]">
                    Thêm vào giỏ hàng
                  </span>
                </div>
                <div>
                  <button
                    type="button"
                    className="px-3 h-[40px] bg-orange-600 text-white rounded-sm border-none cursor-pointer hover:bg-orange-500"
                    onClick={() => handleBuyNow(true)}
                  >
                    Mua ngay
                  </button>
                </div>
              </div>
            </div>
          </Form>
        </Col>
      </Row>

      <ModalDetailBook
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        images={images}
        currentIndex={refGallery.current?.getCurrentIndex() || 0}
        title={book?.mainText}
      />
    </>
  );
};

export default BookDetail;
