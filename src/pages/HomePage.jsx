import React from "react";
import { Typography } from "antd";

const { Title, Paragraph } = Typography;

const HomePage = () => {
  return (
    <div style={{ maxWidth: "800px", textAlign: "center" }}>
      <Title level={2}>Арқа певческая школа</Title>
      <Paragraph>
        Электронное учебное пособие по специальности традиционного пения.
      </Paragraph>
    </div>
  );
};

export default HomePage;
