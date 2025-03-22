import React from "react";
import { List, Typography } from "antd";
import { composers } from "../data/composers";
import { Link } from "react-router-dom";

const { Title } = Typography;

const RecordingsPage = () => {
  return (
    <div style={{ maxWidth: "800px", textAlign: "center", margin: "0 auto" }}>
      <Title level={2}>АУДИОЖАЗБАЛАР</Title>
      <List
        bordered
        dataSource={composers}
        renderItem={(composer) => (
          <List.Item>
            <Link to={`/recordings/${composer.id}`}>{composer.name}</Link>
          </List.Item>
        )}
      />
    </div>
  );
};

export default RecordingsPage;
