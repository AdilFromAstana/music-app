import { List, Typography } from "antd";
import { Link } from "react-router-dom";
import { useData } from "../../../context/DataContext";

const { Title } = Typography;

const ComposersNotePage = () => {
  const { composers, isLoading } = useData();

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
            <Link to={`/composersNotes/${composer.id}`}>{composer.name}</Link>
          </List.Item>
        )}
      />
    </div>
  );
};

export default ComposersNotePage;
