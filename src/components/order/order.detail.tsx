import { createOrderAPI } from "@/services/api";
import { deleteBookLocalStorage } from "@/services/book.service";
import { DeleteOutlined, SmileOutlined } from "@ant-design/icons";
import {
  App,
  Breadcrumb,
  Button,
  Col,
  Divider,
  Form,
  FormProps,
  Image,
  Input,
  InputNumber,
  Radio,
  Result,
  Row,
} from "antd";
import { useForm } from "antd/lib/form/Form";
import TextArea from "antd/lib/input/TextArea";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useCurrentApp } from "../context/app.context";
import OrderStep from "./order.step";

interface FieldType {
  address?: string;
  fullName?: string;
  method: "COD" | "BANKING";
  phone?: string;
}
const OrderDetail = () => {
  const [form] = useForm();
  const [current, setCurrent] = useState<number>(0);
  const { carts, setCarts, user } = useCurrentApp();
  const [loading, setLoading] = useState<boolean>(false);
  const { notification, message } = App.useApp();

  const total = useMemo(() => {
    return carts?.reduce((acc, cart) => {
      return acc + cart.detail.price * cart.quantity;
    }, 0);
  }, [carts]);

  const baseUrl = useMemo(() => {
    return import.meta.env.VITE_BACKEND_URL + "/images/book/";
  }, []);

  const handleDeleteBook = (id: string) => {
    const newCarts = deleteBookLocalStorage(id);

    if (newCarts) {
      setCarts(newCarts);
    }

    if (newCarts.length === 0) {
      setCurrent(0);
    }
  };

  const onFinish: FormProps<FieldType>["onFinish"] = async (
    values: FieldType
  ) => {
    setLoading(true);
    const cartRequest: ICartRequest = {
      address: values.address,
      name: values.fullName,
      type: values.method,
      phone: values.phone,
      totalPrice: total,
      detail: carts.map((cart) => {
        return {
          _id: cart._id,
          quantity: cart.quantity,
          bookName: cart.detail.mainText,
        };
      }),
    };

    // call api

    const res = await createOrderAPI(cartRequest);

    if (res && res.data) {
      setCurrent(2);
      setCarts([]);
      localStorage.removeItem("carts");
      message.success("Đặt hàng thành công");
    } else {
      notification.error({
        message: "Có lỗi xảy ra",
        description: JSON.stringify(res.error),
      });
    }

    setLoading(false);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onFieldChange = (changedFields: any) => {
    if (changedFields) {
      const _id = changedFields[0].name[1];
      const quantity = changedFields[0].value;
      const index = carts.findIndex((cart) => cart._id === _id);

      if (index !== -1) {
        const cart = carts[index];
        cart.quantity = quantity;
        setCarts([...carts]);
        localStorage.setItem("carts", JSON.stringify(carts));
      }
    }
  };

  return (
    <>
      <div className="w-full h-[100vh] bg-gray-200">
        <div className="flex flex-col p-10 space-y-5">
          <Row>
            <Col span={24}>
              <Breadcrumb
                items={[
                  {
                    title: <Link to="/">Trang chủ</Link>,
                  },
                  {
                    title: "Chi tiết giỏ hàng",
                  },
                ]}
              />
            </Col>
          </Row>
          <div className="bg-white p-5 border-solid rounded-lg border-white hidden sm:block">
            <OrderStep
              current={current}
              setCurrent={setCurrent}
              cartLength={carts?.length}
            />
          </div>
          {current !== 2 ? (
            <div className="">
              <Form
                name="basic"
                layout="vertical"
                onFinish={onFinish}
                form={form}
                onFieldsChange={onFieldChange}
              >
                <Row gutter={[12, 12]}>
                  <Col xs={24} xl={16}>
                    {carts?.length !== 0 ? (
                      <Row gutter={[12, 12]}>
                        {carts?.map((cart) => {
                          return (
                            <Col span={24} key={cart._id}>
                              <div className="p-5 bg-white flex flex-col sm:flex-row justify-between items-start sm:items-center border-solid rounded-lg border-white space-y-5 sm:space-y-0">
                                <Col xs={24} xl={0}>
                                  <div>
                                    <p className="text-[13px] capitalize break-words ">
                                      {cart.detail.mainText}
                                    </p>
                                  </div>
                                </Col>

                                <Col xs={0} xl={4}>
                                  <div>
                                    <Image
                                      width={80}
                                      src={baseUrl + cart.detail.thumbnail}
                                      preview={false}
                                    />
                                  </div>
                                </Col>
                                <Col xs={0} xl={6}>
                                  <div>
                                    <p className="text-[13px] capitalize break-words min-w-[200px] max-w-[200px]">
                                      {cart.detail.mainText}
                                    </p>
                                  </div>
                                </Col>
                                <Col xs={0} xl={6}>
                                  <div className="flex items-center justify-center space-x-2 ">
                                    <div className="flex justify-center items-center min-w-[140px] space-x-2">
                                      <span className="text-[14px]">
                                        {new Intl.NumberFormat("vi-VN", {
                                          style: "currency",
                                          currency: "VND",
                                        }).format(cart.detail.price)}
                                      </span>
                                      {current === 0 ? (
                                        <Form.Item
                                          name={["quantity", cart?._id]}
                                          noStyle={true}
                                          initialValue={cart.quantity}
                                        >
                                          <InputNumber min={1} max={1000} />
                                        </Form.Item>
                                      ) : (
                                        <div className="flex justify-center items-center space-x-1 min-w-[100px]">
                                          <span className="text-[14px]">
                                            Số lượng:
                                          </span>
                                          <span>{cart.quantity}</span>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </Col>

                                <div className="flex justify-between items-center sm:hidden w-full">
                                  <div>
                                    <Image
                                      width={80}
                                      src={baseUrl + cart.detail.thumbnail}
                                      preview={false}
                                    />
                                  </div>
                                  <div className="flex items-center justify-center space-x-2 ">
                                    <div className="flex justify-center items-center min-w-[140px] space-x-2">
                                      {current === 0 ? (
                                        <Form.Item
                                          name={["quantity", cart?._id]}
                                          noStyle={true}
                                          initialValue={cart.quantity}
                                        >
                                          <InputNumber min={1} max={1000} />
                                        </Form.Item>
                                      ) : (
                                        <div className="flex justify-center items-center space-x-1 min-w-[100px]">
                                          <span className="text-[14px]">
                                            Số lượng:
                                          </span>
                                          <span>{cart.quantity}</span>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                  <div>
                                    <DeleteOutlined
                                      className="text-pink-500 cursor-pointer"
                                      onClick={() => handleDeleteBook(cart._id)}
                                    />
                                  </div>
                                </div>

                                <Col>
                                  <div className="flex items-center space-x-2 ">
                                    <span className="text-[14px]">Tổng: </span>
                                    <span className="text-[14px]">
                                      {new Intl.NumberFormat("vi-VN", {
                                        style: "currency",
                                        currency: "VND",
                                      }).format(
                                        cart.detail.price * cart.quantity
                                      )}
                                    </span>
                                  </div>
                                </Col>
                                <Col xs={0} xl={1}>
                                  <div>
                                    <DeleteOutlined
                                      className="text-pink-500 cursor-pointer"
                                      onClick={() => handleDeleteBook(cart._id)}
                                    />
                                  </div>
                                </Col>
                              </div>
                            </Col>
                          );
                        })}
                      </Row>
                    ) : (
                      <Result
                        icon={<SmileOutlined />}
                        title="Bạn hiện chưa có sản phẩm quay lại trang chủ để mua hàng"
                        extra={
                          <Button type="primary">
                            <Link to={"/"}>Trang chủ</Link>
                          </Button>
                        }
                      />
                    )}
                  </Col>
                  <Col style={{ flex: 1 }} xl={24}>
                    <div className="flex flex-col space-y-2 bg-white border-solid rounded-lg border-gray-100 p-5">
                      {current !== 0 && (
                        <>
                          <div>
                            <Form.Item<FieldType>
                              name={"method"}
                              label={"Hình thức thanh toán:"}
                              initialValue={"COD"}
                            >
                              <Radio.Group className="flex flex-col space-y-2">
                                <Radio value={"COD"}>
                                  Thanh toán khi nhận hàng
                                </Radio>
                                <Radio value={"BANKING"}>
                                  Chuyển khoản ngân hàng
                                </Radio>
                              </Radio.Group>
                            </Form.Item>

                            <Form.Item<FieldType>
                              name={"fullName"}
                              label={"Họ tên"}
                              initialValue={user?.fullName}
                              rules={[
                                {
                                  required: true,
                                  message: "Họ tên không được để trống",
                                },
                              ]}
                            >
                              <Input />
                            </Form.Item>

                            <Form.Item<FieldType>
                              name={"phone"}
                              label={"Số điện thoại"}
                              initialValue={user?.phone}
                              rules={[
                                {
                                  required: true,
                                  message: "Số điện thoại không được để trống",
                                },
                              ]}
                            >
                              <Input />
                            </Form.Item>

                            <Form.Item<FieldType>
                              name={"address"}
                              label={"Địa chỉ nhận hàng"}
                              initialValue={""}
                              rules={[
                                {
                                  required: true,
                                  message:
                                    "Địa chỉ nhận hàng không được để trống",
                                },
                              ]}
                            >
                              <TextArea rows={4} />
                            </Form.Item>
                          </div>
                        </>
                      )}
                      <div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Tạm tính</span>
                          <span className="text-sm">
                            {new Intl.NumberFormat("vi-VN", {
                              style: "currency",
                              currency: "VND",
                            }).format(total)}
                          </span>
                        </div>
                        <div>
                          <Divider />
                        </div>
                        <div className="flex justify-between">
                          <span>Tổng tiền</span>
                          <span className="text-lg text-orange-600">
                            {new Intl.NumberFormat("vi-VN", {
                              style: "currency",
                              currency: "VND",
                            }).format(total)}
                          </span>
                        </div>
                        <div>
                          <Divider />
                        </div>
                        <div>
                          <Button
                            className={"w-full h-[40px]"}
                            color="danger"
                            variant="solid"
                            disabled={carts?.length === 0}
                            onClick={() => {
                              if (current === 1) {
                                form.submit();
                                return;
                              }
                              setCurrent(1);
                            }}
                            htmlType="button"
                            loading={loading}
                          >
                            {current === 0 ? "Mua Hàng" : "Đặt Hàng"} (
                            {carts?.length})
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Col>
                </Row>
              </Form>
            </div>
          ) : (
            <Result
              status="success"
              title="Đặt hàng thành công"
              subTitle="Hệ thống đã ghi nhận thông tin đơn hàng của bạn"
              extra={[
                <Button type="primary" key="console">
                  <Link to="/">Trang chủ</Link>
                </Button>,
                <Button key="buy">
                  <Link to="/history">Lịch sử mua hàng</Link>
                </Button>,
              ]}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default OrderDetail;
