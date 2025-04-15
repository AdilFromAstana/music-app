import { useRef, useState } from "react";
import { Button, Divider, Typography, message, Modal } from "antd";
import {
  ArrowLeftOutlined,
  PlusOutlined,
  DeleteOutlined,
  SaveOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import { createNotePdf, getNotePdfById } from "../../../../firebase";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const { Title } = Typography;

export const SongDetails = ({ song, onBack }) => {
  const initialPdf = {
    id: 1,
    url: "https://www.antennahouse.com/hubfs/xsl-fo-sample/pdf/basic-link-1.pdf",
  };

  const queryClient = useQueryClient();
  const [pdf, setPdf] = useState(initialPdf);
  const [originalPdf, setOriginalPdf] = useState(initialPdf);
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);

  const isChanged = pdf?.url !== originalPdf?.url;

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    const isPdf = selectedFile.type === "application/pdf";
    const isLt10M = selectedFile.size / 1024 / 1024 < 10;

    if (!isPdf) return message.error("Можно загружать только PDF-файлы!");
    if (!isLt10M) return message.error("PDF должен быть меньше 10MB!");

    const url = URL.createObjectURL(selectedFile);
    setPdf({ id: Date.now(), url });
    setFile(selectedFile); // сохраняем файл для отправки

    e.target.value = "";
  };

  const handleRemove = () => {
    Modal.confirm({
      title: "Удалить PDF?",
      content: "Вы уверены, что хотите удалить файл нот?",
      okText: "Удалить",
      okType: "danger",
      cancelText: "Отмена",
      onOk() {
        setPdf(null);
      },
    });
  };

  const handleReset = () => {
    setPdf(originalPdf);
    message.info("Файл сброшен к оригинальному");
  };

  const handleSave = async () => {
    if (!file) {
      return message.warning("Сначала выберите PDF-файл для загрузки");
    }

    try {
      const composerId = song.composerId || song.id; // уточни, как у тебя называется ID композитора
      const title = song.title;

      await createNotePdf({ composerId, text: title, file });

      setOriginalPdf(pdf);
      setFile(null);
      message.success("Файл успешно загружен");
    } catch (error) {
      message.error("Ошибка при сохранении файла");
      console.error("Ошибка загрузки PDF:", error);
    }
  };

  const { data: notePdf = {} } = useQuery({
    queryKey: ["notePdf", song?.id],
    queryFn: async ({ queryKey }) => {
      const [, params] = queryKey;

      const cachedData = queryClient.getQueryData(["composer", params]);
      if (cachedData) {
        return cachedData;
      }

      return getNotePdfById(params);
    },
    keepPreviousData: true,
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
  });

  console.log("notePdf: ", notePdf);

  return (
    <div>
      <div style={{ position: "relative" }}>
        <Button
          style={{ position: "absolute", top: 0, left: 0 }}
          icon={<ArrowLeftOutlined />}
          onClick={onBack}
        />
        <Title level={2}>{song.title}</Title>
      </div>

      <Divider />

      <div
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
          textAlign: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 8,
            flexWrap: "wrap",
          }}
        >
          <Title level={4} style={{ margin: 0 }}>
            Ноты (PDF)
          </Title>

          <div style={{ display: "flex", gap: 10 }}>
            <Button
              icon={<PlusOutlined />}
              type="dashed"
              onClick={() => fileInputRef.current.click()}
            >
              {pdf ? "Заменить PDF" : "Загрузить PDF"}
            </Button>
            <Button
              icon={<SyncOutlined />}
              onClick={handleReset}
              disabled={!isChanged}
            >
              Сбросить
            </Button>
            <Button
              icon={<SaveOutlined />}
              type="primary"
              onClick={handleSave}
              disabled={!isChanged}
            >
              Сохранить
            </Button>
            {pdf && (
              <Button icon={<DeleteOutlined />} danger onClick={handleRemove} />
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf"
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
        </div>

        {pdf?.url && (
          <div style={{ marginTop: 24 }}>
            <iframe
              src={pdf.url}
              width="100%"
              height="600px"
              title="PDF Preview"
              style={{ border: "1px solid #ccc", borderRadius: 8 }}
            />
          </div>
        )}
      </div>
    </div>
  );
};
