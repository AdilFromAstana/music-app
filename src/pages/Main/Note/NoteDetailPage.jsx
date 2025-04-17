import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Typography, Button, Alert, Spin } from "antd";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getNotePdfById } from "../../../firebase";
import { useMediaQuery } from "react-responsive";

const { Title } = Typography;

const NoteDetailPage = () => {
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const { compositionId } = useParams();
  const queryClient = useQueryClient();

  const [isIframeLoaded, setIsIframeLoaded] = useState(false);
  const [iframeError, setIframeError] = useState(false);

  const {
    data: composition,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["composition", compositionId],
    queryFn: async ({ queryKey }) => {
      const [, params] = queryKey;
      const cachedData = queryClient.getQueryData(["notePdfs", params]);
      return cachedData || getNotePdfById(params);
    },
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    setIsIframeLoaded(false);
    setIframeError(false);
  }, [composition?.notePdfLink]);

  if (isLoading) return <Spin tip="Загрузка нот..." size="large" />;
  if (error)
    return (
      <Alert
        message="Ошибка загрузки"
        description={error.message}
        type="error"
      />
    );
  if (!composition?.notePdfLink)
    return <Title level={2}>Ноты не найдены</Title>;

  return (
    <div
      style={{
        maxWidth: "100%",
        margin: "0 auto",
        padding: isMobile ? "8px" : "16px",
        background: "white",
        borderRadius: "10px",
      }}
    >
      {isMobile ? (
        <h3 style={{ textAlign: "center" }}>
          {composition?.title || "Просмотр нот"}
        </h3>
      ) : (
        <h4 style={{ textAlign: "center" }}>
          {composition?.title || "Просмотр нот"}
        </h4>
      )}

      {!isIframeLoaded && !iframeError && (
        <div
          style={{
            width: "100%",
            height: 500,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Spin tip="Загрузка документа..." size="large" />
        </div>
      )}

      {iframeError && (
        <Alert
          message="Не удалось загрузить PDF"
          description="Попробуйте открыть в новом окне."
          type="error"
          style={{ marginBottom: 16 }}
        />
      )}

      {!iframeError && (
        <iframe
          src={`https://docs.google.com/viewer?url=${encodeURIComponent(
            composition.notePdfLink
          )}&embedded=true`}
          width="100%"
          height="500px"
          style={{
            border: "none",
            borderRadius: 8,
            display: isIframeLoaded ? "block" : "none",
          }}
          title="Google PDF Viewer"
          onLoad={() => setIsIframeLoaded(true)}
          onError={() => setIframeError(true)}
        />
      )}

      <div style={{ marginTop: 24, textAlign: "center" }}>
        <a
          href={composition.notePdfLink}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button type="primary" size={isMobile ? "middle" : "large"}>
            Открыть в отдельном окне
          </Button>
        </a>
      </div>
    </div>
  );
};

export default NoteDetailPage;
