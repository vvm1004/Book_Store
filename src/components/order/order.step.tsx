import { Steps } from "antd";

interface IOrderStepProps {
  current: number;
  cartLength: number;
  setCurrent: (value: number) => void;
}
const OrderStep = (props: IOrderStepProps) => {
  const { current, setCurrent, cartLength } = props;
  return (
    <>
      <Steps
        size="small"
        current={current}
        onChange={(current) => setCurrent(current)}
        items={[
          {
            title: "Đơn hàng",
            className: "cursor-pointer",
          },
          {
            title: "Đặt hàng",
            className: "cursor-pointer",
            disabled: cartLength === 0,
          },
          {
            title: "Thanh toán",
            className: "cursor-pointer",
            disabled: true,
          },
        ]}
      />
    </>
  );
};

export default OrderStep;
