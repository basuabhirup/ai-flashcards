import { useState } from "react";
import { Card, CardBody } from "@nextui-org/react";

interface IProps {
  frontContent: string;
  backContent: string;
}

const FlippableCard = ({ frontContent, backContent }: IProps) => {
  const [isFlipped, setIsFlipped] = useState<boolean>(false);

  const handleClick = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div className="w-[200px] h-[240px]" style={{ perspective: "1000px" }}>
      <div
        className="relative w-full h-full transition-transform duration-500 cursor-pointer"
        style={{
          transformStyle: "preserve-3d",
          ...(!!isFlipped && { transform: "rotateY(180deg)" }),
        }}
        onClick={handleClick}
      >
        <Card
          className="absolute w-full h-full dark:bg-gray-800"
          style={{ backfaceVisibility: "hidden" }}
        >
          <CardBody className="flex items-center justify-center p-4">
            <p className="text-sm font-bold text-center">{frontContent}</p>
          </CardBody>
        </Card>
        <Card
          className="absolute w-full h-full dark:bg-gray-800"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          <CardBody className="flex items-center justify-center p-4">
            <p className="text-sm font-bold text-center">{backContent}</p>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default FlippableCard;
