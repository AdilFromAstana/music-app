import React from "react";
import { List, Typography } from "antd";
import { Link } from "react-router-dom";
import { useComposers } from "../../../context/ComposersContext";

const { Title } = Typography;

const ComposersNotePage = () => {
  const { composers, isLoading } = useComposers();

  return (
    <div
      style={{
        maxWidth: "800px",
        textAlign: "center",
        margin: "0 auto",
        width: "100%",
      }}
    >
      <Title level={2}>НОТАЛАР</Title>
      <List
        loading={isLoading}
        bordered
        dataSource={composers}
        renderItem={(composer) => (
          <List.Item>
            <Link to={`/composers-notes/${composer.id}`}>{composer.name}</Link>
          </List.Item>
        )}
      />
    </div>
  );
};

export default ComposersNotePage;
