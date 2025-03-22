import React from "react";
import { List, Typography } from "antd";
import { Link } from "react-router-dom";
import { composers } from "../data/composers";

const { Title } = Typography;

const ComposersPage = () => {
  return (
    <div style={{ maxWidth: "800px", textAlign: "center", margin: "0 auto" }}>
      <Title level={2}>ХАЛЫҚ КОМПОЗИТОРЛАРЫ</Title>
      <List
        bordered
        dataSource={composers}
        renderItem={(composer) => (
          <List.Item>
            <Link to={`/composers/${composer.id}`}>{composer.name}</Link>
          </List.Item>
        )}
      />
    </div>
  );
};

export default ComposersPage;
