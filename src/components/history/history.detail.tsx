import { Drawer } from "antd";

interface IHistoryDetailProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  historyDetail: IHistoryTable | null;
}
const HistoryDetail = (props: IHistoryDetailProps) => {
  const { open, setOpen, historyDetail } = props;

  const onClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Drawer title="Chi tiết đơn hàng" onClose={onClose} open={open}>
        <div className="flex flex-col space-y-5">
          {historyDetail?.detail.map((item) => {
            return (
              <ul key={item._id} className="flex flex-col space-y-2">
                <li className=" capitalize">Tên sách: {item.bookName}</li>
                <li>Số lượng: {item.quantity}</li>
              </ul>
            );
          })}
        </div>
      </Drawer>
    </>
  );
};

export default HistoryDetail;
