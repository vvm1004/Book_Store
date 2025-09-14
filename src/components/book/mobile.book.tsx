import { getCategoryBookAPI } from "@/services/api";
import {
  Button,
  Checkbox,
  Col,
  Divider,
  Drawer,
  Form,
  InputNumber,
  Row,
} from "antd";
import { FormProps, useForm } from "antd/lib/form/Form";
import { useEffect, useState } from "react";

interface MobileBookProps {
  open: boolean;
  setOpen: (value: boolean) => void;
  setPrice: (price: number[]) => void;
  setQueryCategory: (query: string[]) => void;
}
type FieldType = {
  formPrice?: number;
  endPrice?: number;
};
const MobileBook = (props: MobileBookProps) => {
  const { open, setOpen, setPrice, setQueryCategory } = props;

  const [form] = useForm();

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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onValuesChange = (changedValues: any) => {
    // Đây là nơi nhận giá trị thay đổi theo thời gian
    if (changedValues && changedValues?.checkBoxGroup?.length !== 0) {
      setQueryCategory([...(changedValues?.checkBoxGroup as string[])]);
    } else {
      setQueryCategory([]);
    }
  };

  const onClose = () => {
    setOpen(false);
    form.resetFields();
  };

  return (
    <>
      <Drawer title="Lọc sản phẩm" onClose={onClose} open={open} width={"80vw"}>
        <div>
          <p>Danh mục sản phẩm</p>
        </div>
        <Form
          name="basic"
          onFinish={onFinish}
          form={form}
          onValuesChange={onValuesChange}
        >
          <div>
            <Form.Item name={"checkBoxGroup"} initialValue={[]}>
              <Checkbox.Group
                style={{ width: "100%" }}
                name="checkBoxGroup"
                //   onChange={onChangeCheckBox}
                //   value={queryCategory}
              >
                <Row>
                  {category.map((cate, index) => {
                    return (
                      <Col
                        span={24}
                        key={index}
                        style={{ marginBottom: "10px" }}
                      >
                        <Checkbox value={cate}>
                          <span>{cate}</span>
                        </Checkbox>
                      </Col>
                    );
                  })}
                </Row>
              </Checkbox.Group>
            </Form.Item>
          </div>
          <div>
            <Divider />
            <p>Khoảng giá</p>
          </div>
          <div>
            <div className="flex space-x-7">
              <Form.Item<FieldType> name="formPrice">
                <InputNumber
                  formatter={(value) => {
                    return `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                  }}
                />
              </Form.Item>
              <span>-</span>
              <Form.Item<FieldType> name="endPrice">
                <InputNumber
                  formatter={(value) => {
                    return `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
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
          </div>
        </Form>
      </Drawer>
    </>
  );
};

export default MobileBook;
