import { Col, Row, Skeleton } from "antd";
const BookLoader = () => {
  return (
    <>
      <Row gutter={20}>
        <Col xs={0} xl={8}>
          <div className="flex flex-col space-y-2">
            <Skeleton.Image
              active={true}
              style={{ width: "400px", height: "400px" }}
            />

            <div className="flex space-x-2  items-center">
              <Skeleton.Image
                active={true}
                style={{ width: "120px", height: "120px" }}
              />

              <Skeleton.Image
                active={true}
                style={{ width: "120px", height: "120px" }}
              />

              <Skeleton.Image
                active={true}
                style={{ width: "120px", height: "120px" }}
              />
            </div>
          </div>
        </Col>
        <Col xl={16}>
          <div className="flex flex-col space-y-5 mt-10 sm:mt-0">
            <Skeleton.Input active={true} size="large" />

            <p className="text-[24px] text-[#676666] font-[150] capitalize"></p>
            <Skeleton.Input active={true} size="large" />

            <Skeleton.Input active={true} size="large" />

            <div className="bg-gray-100 h-20 flex items-center ">
              <Skeleton.Input active={true} size="large" />
            </div>

            <Skeleton.Input active={true} size="large" />

            <div className="flex space-x-5">
              <div>
                <Skeleton.Button active={true} size="large" />
              </div>
              <div>
                <Skeleton.Button active={true} size="large" />
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </>
  );
};

export default BookLoader;
