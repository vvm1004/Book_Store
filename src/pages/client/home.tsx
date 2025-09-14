import Category from "@/components/home/category/category";
import ProductTable from "@/components/home/product/product.table";
import { Col, Row } from "antd";
import { useState } from "react";
const HomePage = () => {
  const [queryCategory, setQueryCategory] = useState<string[]>([]);
  const [price, setPrice] = useState<number[]>([]);
  return (
    <>
      <Row
        style={{ height: "100vh", padding: "10px 20px" }}
        gutter={15}
        wrap={true}
      >
        <Col xl={5} className="sm:block hidden">
          <Category
            queryCategory={queryCategory}
            setQueryCategory={setQueryCategory}
            setPrice={setPrice}
          />
        </Col>
        <Col xs={24} style={{ flex: 1 }}>
          <ProductTable
            queryCategory={queryCategory}
            price={price}
            setPrice={setPrice}
            setQueryCategory={setQueryCategory}
          />
        </Col>
      </Row>
    </>
  );
};

export default HomePage;
