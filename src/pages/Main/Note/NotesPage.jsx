import { Typography, Divider, Spin, Alert } from "antd";
import { useQuery } from "@tanstack/react-query";
import { getNotePdfById } from "../../../firebase/notePdf";

const { Title } = Typography;

const NotesPage = () => {
  const {
    data: notePdf,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["notePdf"],
    queryFn: () => getNotePdfById(),
    staleTime: 5 * 60 * 1000,
  });

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      {isLoading ? (
        <div
          style={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Spin size="large" />
        </div>
      ) : error ? (
        <Alert type="error" message="Ошибка загрузки PDF" />
      ) : notePdf?.notePdfLink ? (
        <div style={{ flex: 1 }}>
          <iframe
            src={notePdf.notePdfLink}
            width="100%"
            height="100%"
            title="PDF Preview"
            style={{ border: "none" }}
          />
        </div>
      ) : (
        <Alert type="info" message="Файл PDF пока не загружен" />
      )}
    </div>
  );
};

export default NotesPage;
