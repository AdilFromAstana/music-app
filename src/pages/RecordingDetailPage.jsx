import React from "react";
import { useParams } from "react-router-dom";
import { Typography, Button } from "antd";
import { composers } from "../data/composers";

const { Title, Paragraph } = Typography;

const RecordingDetailPage = () => {
  const { id } = useParams();
  console.log(id);
  const composer = composers.find((comp) => comp.id == id);

  if (!composer) {
    return <Title level={2}>Музыка не найдена</Title>;
  }

  return (
    <div style={{ maxWidth: "800px", textAlign: "center" }}>
      <img
        src={composer.image}
        alt={composer.name}
        style={{ width: "100%", borderRadius: "10px" }}
      />
      <Title level={2}>{composer.name}</Title>
      <Paragraph>{composer.bio}</Paragraph>
      <Button type="primary" onClick={() => window.history.back()}>
        Назад
      </Button>
    </div>
  );
};

export default RecordingDetailPage;
