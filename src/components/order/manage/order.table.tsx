import { getOrderAPI } from "@/services/api";
import { ActionType, ProColumns, ProTable } from "@ant-design/pro-components";
import dayjs from "dayjs";
import { useRef, useState } from "react";

type FieldSort = {
  totalPrice?: string;
  createdAt?: string;
};
type FieldSearch = {
  pageSize?: number;
  current?: number;
  name?: string;
  address?: string;
};
const OrderTable = () => {
  const actionRef = useRef<ActionType>();
  const [pageSize, setPageSize] = useState<number>(5);
  const [orders, setOrders] = useState<IHistoryTable[]>([]);
  const columns: ProColumns<IHistoryTable>[] = [
    {
      dataIndex: "index",
      valueType: "indexBorder",
      width: 48,
    },
    {
      title: "Id",
      dataIndex: "_id",
      render: (index, record) => {
        return <a href="#">{record._id}</a>;
      },
      search: false,
    },
    { title: "Full Name", dataIndex: "name" },
    { title: "Address", dataIndex: "address" },
    {
      title: "Giá tiền",
      dataIndex: "totalPrice",
      sorter: true,
      search: false,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      render(dom, entity, index, action, schema) {
        return (
          <span>
            {new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
            }).format(entity?.totalPrice)}
          </span>
        );
      },
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      valueType: "dateRange",
      search: false,
      sorter: true,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      render(dom, entity, index, action, schema) {
        return <span>{dayjs(entity?.createdAt).format("YYYY-MM-DD")}</span>;
      },
    },
  ];

  const handleSearch = (params: FieldSearch) => {
    let query = "";
    const { name, address } = params;

    if (name) {
      query += `&name=/${name}/i`;
    }

    if (address) {
      query += `&address=/${address}/i`;
    }

    return query;
  };

  const handleSort = (sort: FieldSort) => {
    const { totalPrice, createdAt } = sort;
    let querySort = "";

    if (totalPrice) {
      querySort +=
        (totalPrice === "ascend" ? "&sort=totalPrice" : "&sort=-totalPrice") +
        ",";
    }

    if (createdAt) {
      querySort +=
        (createdAt === "ascend" ? "&sort=createdAt" : "&sort=-createdAt") + ",";
    }

    if (querySort.length > 0) {
      querySort = querySort.slice(0, -1);
    } else {
      querySort = "&sort=-createdAt";
    }

    return querySort;
  };

  return (
    <>
      <ProTable<IHistoryTable>
        columns={columns}
        actionRef={actionRef}
        cardBordered
        rowKey="_id"
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        request={async (params: FieldSearch, sort: FieldSort) => {
          console.log("params", params);
          const { current } = params; // destructuring params
          const querySearch = handleSearch(params);
          const sortQuery = handleSort(sort);

          if (pageSize !== params.pageSize) {
            setPageSize(params.pageSize || 5);
          }

          const res = await getOrderAPI(
            current || 1,
            params.pageSize || 5,
            querySearch,
            sortQuery
          );
          if (res && res.data) {
            setOrders(res.data.result);
          }
          return {
            data: res.data?.result,
            success: true,
            total: res.data?.meta.total,
            pageSize: res.data?.meta.pageSize,
            page: res.data?.meta.current,
          };
        }}
        dataSource={orders}
        pagination={{
          pageSize: pageSize,
          showSizeChanger: true,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} trên ${total} rows`,
        }}
        dateFormatter="string"
        headerTitle="Table Orders"
        key={"_id"}
      />
    </>
  );
};

export default OrderTable;
