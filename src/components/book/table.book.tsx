import { getBooksAPI } from "@/services/api";
import { EditOutlined, ExportOutlined, PlusOutlined } from "@ant-design/icons";
import type { ActionType, ProColumns } from "@ant-design/pro-components";
import { ProTable } from "@ant-design/pro-components";
import { Button } from "antd";
import dayjs from "dayjs";
import { useRef, useState } from "react";
import { CSVLink } from "react-csv";
import DeleteBook from "./delete.book";
import SaveBook from "./save.book";
import ViewBook from "./view.book";

type FieldSort = {
  mainText?: string;
  author?: string;
  price?: string;
};
type FieldSearch = {
  pageSize?: number;
  current?: number;
  keyword?: string;
  mainText?: string;
  author?: string;
};
const TableBook = () => {
  const actionRef = useRef<ActionType>();
  const [pageSize, setPageSize] = useState<number>(5);
  const [books, setBooks] = useState<IBookTable[]>([]);
  const [openView, setOpenView] = useState<boolean>(false);
  const [book, setBook] = useState<IBookTable | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const columns: ProColumns<IBookTable>[] = [
    {
      dataIndex: "index",
      valueType: "indexBorder",
      width: 48,
    },
    {
      title: "Id",
      dataIndex: "_id",
      render: (index, record) => {
        return (
          <a
            href="#"
            onClick={() => {
              setOpenView(true);
              setBook(record);
            }}
          >
            {record._id}
          </a>
        );
      },
      search: false,
    },
    { title: "Tên sách", dataIndex: "mainText", sorter: true },
    { title: "Thể loại", dataIndex: "category", search: false },
    { title: "Tác giả", dataIndex: "author", sorter: true },
    {
      title: "Giá tiền",
      dataIndex: "price",
      sorter: true,
      search: false,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      render(dom, entity, index, action, schema) {
        return (
          <span>
            {new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
            }).format(entity?.price)}
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
    {
      title: "Action",
      search: false,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      render(dom, entity, index, action, schema) {
        return (
          <div style={{ display: "flex", gap: "15px" }}>
            <EditOutlined
              style={{ cursor: "pointer", color: "orange" }}
              onClick={() => {
                setIsModalOpen(true);
                setBook(entity);
              }}
            />

            <DeleteBook id={entity._id} actionRef={actionRef} />
          </div>
        );
      },
    },
  ];

  const handleSearch = (params: FieldSearch) => {
    let query = "";
    const { mainText, author } = params;

    if (mainText) {
      query += `&mainText=/${mainText}/i`;
    }

    if (author) {
      query += `&author=/${author}/i`;
    }

    return query;
  };

  const handleSort = (sort: FieldSort) => {
    const { mainText, author, price } = sort;
    let querySort = "";

    if (mainText) {
      querySort +=
        (mainText === "ascend" ? "&sort=mainText" : "&sort=-mainText") + ",";
    }

    if (author) {
      querySort +=
        (author === "ascend" ? "&sort=author" : "&sort=-author") + ",";
    }

    if (price) {
      querySort += (price === "ascend" ? "&sort=price" : "&sort=-price") + ",";
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
      <ProTable<IBookTable>
        columns={columns}
        actionRef={actionRef}
        cardBordered
        rowKey="_id"
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        request={async (params: FieldSearch, sort: FieldSort) => {
          console.log("params", params);
          const { current } = params; // destructuring params
          const query = handleSearch(params);
          const sortQuery = handleSort(sort);

          if (pageSize !== params.pageSize) {
            setPageSize(params.pageSize || 5);
          }

          const res = await getBooksAPI(
            current || 1,
            params.pageSize || 5,
            query,
            sortQuery
          );
          setBooks(res.data?.result || []);
          return {
            data: res.data?.result,
            success: true,
            total: res.data?.meta.total,
            pageSize: res.data?.meta.pageSize,
            page: res.data?.meta.current,
          };
        }}
        pagination={{
          pageSize: pageSize,
          showSizeChanger: true,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} trên ${total} rows`,
        }}
        dateFormatter="string"
        headerTitle="Table book"
        toolBarRender={() => [
          <CSVLink data={books} filename="book-export.csv">
            <Button key="button" icon={<ExportOutlined />} type="primary">
              Export
            </Button>
          </CSVLink>,
          <Button
            key="button"
            icon={<PlusOutlined />}
            onClick={() => {
              setIsModalOpen(true);
            }}
            type="primary"
          >
            Add new
          </Button>,
        ]}
      />

      <ViewBook
        open={openView}
        setOpen={setOpenView}
        book={book}
        setBook={setBook}
      />

      <SaveBook
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        actionRef={actionRef}
        book={book}
        setBook={setBook}
      />
    </>
  );
};

export default TableBook;
