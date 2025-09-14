import { getCategoryBookAPI } from "@/services/api";
import { FilterOutlined, RedoOutlined } from "@ant-design/icons";
import {
  Button,
  Checkbox,
  Col,
  Divider,
  Flex,
  Form,
  FormProps,
  GetProp,
  InputNumber,
  Rate,
  Row,
} from "antd";
import Paragraph from "antd/es/typography/Paragraph";
import { useForm } from "antd/lib/form/Form";
import { useEffect, useState } from "react";

type FieldType = {
  formPrice?: number;
  endPrice?: number;
};
interface IProps {
  queryCategory: string[];
  setQueryCategory: (query: string[]) => void;
  setPrice: (price: number[]) => void;
}
const Category = (props: IProps) => {
  const [form] = useForm();
  const { queryCategory, setQueryCategory, setPrice } = props;
  const rates: number[] = [5, 4, 3, 2, 1];
  const [category, setCategory] = useState<string[]>([]);

  // fetch category
  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await getCategoryBookAPI();

        if (response && response.data) {
          setCategory(response.data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchCategory();
  }, []);

  const onFinish: FormProps<FieldType>["onFinish"] = async (
    values: FieldType
  ) => {
    const { formPrice, endPrice } = values;

    if (formPrice && endPrice) {
      setPrice([formPrice, endPrice]);
    } else {
      setPrice([]);
    }
  };

  const onChangeCheckBox: GetProp<typeof Checkbox.Group, "onChange"> = (
    checkedValues
  ) => {
    if (checkedValues.length !== 0) {
      setQueryCategory([...(checkedValues as string[])]);
    } else {
      setQueryCategory([]);
    }
  };

  const resetData = () => {
    setQueryCategory([]);
    setPrice([]);
    form.resetFields();
  };

  return (
    <div className="p-2 border-2 border-solid border-gray-100">
      <Row>
        <Col span={24}>
          <Row justify={"space-between"}>
            <Col>
              <Paragraph>
                <div className="flex gap-2">
                  <FilterOutlined className="text-blue-600" />
                  <span className=" font-bold">Bộ lọc tìm kiếm</span>
                </div>
              </Paragraph>
            </Col>
            <Col>
              <RedoOutlined
                rotate={250}
                className=" cursor-pointer"
                onClick={() => resetData()}
              />
            </Col>
          </Row>
        </Col>
        <Col span={24}>
          <Divider></Divider>
        </Col>
        <Col span={24}>
          <Row style={{ margin: "5px 0px" }}>
            <Col span={24}>
              <Paragraph>
                <p>Danh mục sản phẩm</p>
              </Paragraph>
            </Col>
          </Row>
        </Col>
        <Col span={24}>
          <Checkbox.Group
            style={{ width: "100%" }}
            onChange={onChangeCheckBox}
            value={queryCategory}
          >
            <Row>
              {category.map((cate, index) => {
                return (
                  <Col span={24} key={index} style={{ marginBottom: "10px" }}>
                    <Checkbox value={cate}>
                      <span>{cate}</span>
                    </Checkbox>
                  </Col>
                );
              })}
            </Row>
          </Checkbox.Group>
        </Col>
        <Col span={24}>
          <Divider></Divider>
        </Col>
        <Col span={24}>
          <Row>
            <Col span={24}>
              <Paragraph>Khoảng giá</Paragraph>
            </Col>
            <Row style={{ marginTop: "10px" }}>
              <Col span={24}>
                <Form name="basic" onFinish={onFinish} form={form}>
                  <div className="flex space-x-7">
                    <Form.Item<FieldType> name="formPrice">
                      <InputNumber
                        formatter={(value) => {
                          return `${value}`.replace(
                            /\B(?=(\d{3})+(?!\d))/g,
                            ","
                          );
                        }}
                      />
                    </Form.Item>
                    <span>-</span>
                    <Form.Item<FieldType> name="endPrice">
                      <InputNumber
                        formatter={(value) => {
                          return `${value}`.replace(
                            /\B(?=(\d{3})+(?!\d))/g,
                            ","
                          );
                        }}
                      />
                    </Form.Item>
                  </div>
                  <Button
                    type="primary"
                    style={{ width: "100%" }}
                    onClick={() => form.submit()}
                  >
                    Áp dụng
                  </Button>
                </Form>
              </Col>
            </Row>
          </Row>

          <Row>
            <Col span={24} style={{ marginTop: "20px" }}>
              <Paragraph>Đánh giá</Paragraph>
            </Col>
            {rates.map((rateNumber, index) => {
              return (
                <Col span={24} key={index}>
                  <Flex gap="middle">
                    <Rate
                      defaultValue={rateNumber}
                      disabled
                      className="text-sm"
                    />
                    <span>trở lên</span>
                  </Flex>
                </Col>
              );
            })}
          </Row>
        </Col>
      </Row>
    </div>
  );
};

export default Category;
