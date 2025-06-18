import { useEffect, useRef, useState } from "react";
import { Button, Divider, Typography, message, Modal } from "antd";
import {
  ArrowLeftOutlined,
  PlusOutlined,
  DeleteOutlined,
  SaveOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createNotePdf,
  getNotePdfById,
  deleteNotePdf,
} from "../../../firebase/notePdf";

const { Title } = Typography;

export const SongDetails = () => {
  const queryClient = useQueryClient();
  const fileInputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [tempUrl, setTempUrl] = useState(null);

  const { data: notePdf, refetch } = useQuery({
    queryKey: ["notePdf", song.id],
    queryFn: () => getNotePdfById(song.id),
    staleTime: 5 * 60 * 1000,
  });

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;

    if (selected.type !== "application/pdf") {
      return message.error("Только PDF-файлы");
    }

    if (selected.size / 1024 / 1024 > 10) {
      return message.error("Размер должен быть меньше 10MB");
    }

    setFile(selected);
    setTempUrl(URL.createObjectURL(selected));
    e.target.value = "";
  };

  const handleRemove = () => {
    Modal.confirm({
      title: "Удалить PDF?",
      content: "Вы действительно хотите удалить файл?",
      okText: "Удалить",
      okType: "danger",
      cancelText: "Отмена",
      onOk: async () => {
        try {
          await deleteNotePdf(song.id);
          setFile(null);
          setTempUrl(null);
          queryClient.invalidateQueries(["notePdf", song.id]);
          message.success("Файл удалён");
        } catch {
          message.error("Ошибка удаления");
        }
      },
    });
  };

  const handleReset = () => {
    setFile(null);
    setTempUrl(null);
    message.info("Сброшено к оригиналу");
  };

  const handleSave = async () => {
    if (!file) {
      return message.warning("Выберите новый PDF-файл");
    }

    try {
      await createNotePdf({
        composerId: song.composerId || song.id,
        text: song.title,
        file,
      });
      setFile(null);
      setTempUrl(null);
      refetch();
      message.success("PDF обновлён");
    } catch (err) {
      console.error(err);
      message.error("Ошибка загрузки PDF");
    }
  };

  const previewUrl = tempUrl || notePdf?.url;

  return (
    <div>
      <div style={{ position: "relative" }}>
        <Title level={2}>{song.title}</Title>
      </div>

      <Divider />

      <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
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
              {notePdf?.url || tempUrl ? "Заменить PDF" : "Загрузить PDF"}
            </Button>
            <Button
              icon={<SyncOutlined />}
              onClick={handleReset}
              disabled={!file}
            >
              Сбросить
            </Button>
            <Button
              icon={<SaveOutlined />}
              type="primary"
              onClick={handleSave}
              disabled={!file}
            >
              Сохранить
            </Button>
            {(notePdf?.url || tempUrl) && (
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

        {previewUrl && (
          <div style={{ marginTop: 24 }}>
            <iframe
              src={previewUrl}
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
