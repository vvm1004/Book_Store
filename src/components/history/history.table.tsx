import { getHistoriesAPI } from "@/services/api";
import { Col, Divider, Row, Table, TableProps, Tag } from "antd";
import dayjs from "dayjs";
import { useCallback, useEffect, useState } from "react";
import HistoryDetail from "./history.detail";
const HistoryTable = () => {
  const [histories, setHistories] = useState<IHistoryTable[]>([]);
  const [open, setOpen] = useState(false);
  const [historyDetail, setHistoryDetail] = useState<IHistoryTable | null>(
    null
  );

  const fetchHistory = useCallback(async () => {
    const res = await getHistoriesAPI();
    if (res && res.data) {
      setHistories(res.data);
    }
  }, []);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const columns: TableProps<IHistoryTable>["columns"] = [
    {
      title: "STT",
      dataIndex: "stt",
      render: (text, record, index) => {
        return index + 1;
      },
    },
    {
      title: "Thời gian",
      dataIndex: "createdAt",
      render: (record) => {
        return dayjs(record.createdAt).format("DD-MM-YYYY");
      },
    },
    {
      title: "Tổng số tiền",
      dataIndex: "totalPrice",
      render: (index, record) => {
        return new Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND",
        }).format(record.totalPrice);
      },
    },
    {
      title: "Trạng thái",
      dataIndex: "paymentStatus",
      render: () => {
        return <Tag color="success">Thành công</Tag>;
      },
    },
    {
      title: "Chi tiết",
      render: (record) => (
        <a
          href={"#"}
          onClick={() => {
            setHistoryDetail(record);
            setOpen(true);
          }}
        >
          Xem chi tiết
        </a>
      ),
    },
  ];

  return (
    <>
      <Row className="p-10">
        <Col span={24}>Lịch sử mua hàng</Col>
        <Col span={24}>
          <Divider />
        </Col>
        <Col span={24}>
          <Table<IHistoryTable>
            columns={columns}
            dataSource={histories}
            bordered
            rowKey={(record) => record._id}
          />
        </Col>
      </Row>
      <HistoryDetail
        open={open}
        setOpen={setOpen}
        historyDetail={historyDetail}
      />
    </>
  );
};

export default HistoryTable;
