import React from "react";
import { Typography } from "antd";

const { Title, Paragraph } = Typography;

const HomePage = () => {
  return (
    <div style={{ maxWidth: "800px", textAlign: "center", margin: "0 auto" }}>
      <Title level={2}>Арқа әншілік мектебі</Title>
      <Paragraph>Дәстүрлі ән мамандығы бойынша электронды оқу құралы</Paragraph>
    </div>
  );
};

export default HomePage;
