import { getDashboardAPI } from "@/services/api";
import { Col, Row, Statistic } from "antd";
import { StatisticProps } from "antd/lib";
import { useEffect, useState } from "react";
import CountUp from "react-countup";

const DashBoardPage = () => {
  const [dashboard, setDashboard] = useState<IDashBoard | null>(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      const res = await getDashboardAPI();

      if (res && res.data) {
        setDashboard(res.data);
      }
    };
    fetchDashboard();
  }, []);

  const formatter: StatisticProps["formatter"] = (value) => (
    <CountUp end={value as number} separator="," />
  );

  return (
    <>
      <Row gutter={20}>
        <Col span={8}>
          <div className="p-5 flex flex-col space-y-3 border-solid border-gray-200 rounded-lg bg-white">
            <p className="text-gray-300">Tổng User</p>
            <Statistic value={dashboard?.countUser} formatter={formatter} />
          </div>
        </Col>
        <Col span={8}>
          <div className="p-5 flex flex-col space-y-3 border-solid border-gray-200 rounded-lg bg-white">
            <p className="text-gray-300">Tổng đơn hàng</p>
            <Statistic value={dashboard?.countOrder} formatter={formatter} />
          </div>
        </Col>
        <Col span={8}>
          <div className="p-5 flex flex-col space-y-3 border-solid border-gray-200 rounded-lg bg-white">
            <p className="text-gray-300">Tổng Books</p>
            <Statistic value={dashboard?.countBook} formatter={formatter} />
          </div>
        </Col>
      </Row>
    </>
  );
};

export default DashBoardPage;
