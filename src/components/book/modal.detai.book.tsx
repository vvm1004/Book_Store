import { Col, Image, Modal, Row } from "antd";
import { useEffect, useRef, useState } from "react";
import ReactImageGallery from "react-image-gallery";

interface IPropType {
  isModalOpen: boolean;
  setIsModalOpen: (value: boolean) => void;
  images: {
    original: string;
    thumbnail: string;
  }[];
  currentIndex: number;
  title?: string;
}
const ModalDetailBook = (props: IPropType) => {
  const { isModalOpen, setIsModalOpen, images } = props;
  const refGallery = useRef<ReactImageGallery>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  useEffect(() => {
    setCurrentIndex(props.currentIndex);
  }, [props.currentIndex]);

  const handleCancel = () => {
    setIsModalOpen(false);
    setCurrentIndex(0);
  };

  return (
    <>
      <Modal
        width={"60vw"}
        open={isModalOpen}
        onCancel={handleCancel}
        okButtonProps={{
          style: {
            display: "none",
          },
        }}
        cancelButtonProps={{
          style: {
            display: "none",
          },
        }}
        closable={false}
      >
        <Row gutter={12}>
          <Col span={16}>
            <ReactImageGallery
              items={images}
              showFullscreenButton={false}
              showPlayButton={false}
              showThumbnails={false}
              startIndex={currentIndex}
              ref={refGallery}
              onSlide={(currentIndex) => {
                setCurrentIndex(currentIndex);
              }}
            />
          </Col>
          <Col span={8}>
            <Row style={{ marginBottom: "10px" }}>
              <Col>
                <p className="text-sm">{props.title}</p>
              </Col>
            </Row>
            <Row gutter={[12, 12]}>
              {images.map((item, index) => {
                return (
                  <Col span={12} key={index}>
                    <div
                      className={
                        index === currentIndex
                          ? "border-2 border-solid border-blue-500 w-full cursor-pointer"
                          : "cursor-pointer"
                      }
                      key={index}
                      onClick={() => {
                        refGallery.current?.slideToIndex(index);
                        setCurrentIndex(index);
                      }}
                    >
                      <Image width={120} src={item.thumbnail} preview={false} />
                    </div>
                  </Col>
                );
              })}
            </Row>
          </Col>
        </Row>
      </Modal>
    </>
  );
};

export default ModalDetailBook;
