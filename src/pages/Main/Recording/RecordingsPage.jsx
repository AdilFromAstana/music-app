import { List, Typography } from "antd";
import { Link } from "react-router-dom";
import { useData } from "../../../context/DataContext";

const { Title } = Typography;

const RecordingsPage = () => {
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
      <Title level={2}>АУДИОЖАЗБАЛАР</Title>
      <List
        loading={isLoading}
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
