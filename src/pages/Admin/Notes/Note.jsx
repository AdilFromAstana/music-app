import { useRef, useState } from "react";
import { Button, Divider, Typography, message, Modal } from "antd";
import {
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

const Note = () => {
  const queryClient = useQueryClient();
  const fileInputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [tempUrl, setTempUrl] = useState(null);

  const { data: notePdf, refetch } = useQuery({
    queryKey: ["notePdf"],
    queryFn: () => getNotePdfById(),
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
          await deleteNotePdf();
          setFile(null);
          setTempUrl(null);
          queryClient.invalidateQueries(["notePdf"]);
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
    if (!file) return message.warning("Выберите новый PDF-файл");

    try {
      await createNotePdf({ file });
      setFile(null);
      setTempUrl(null);
      refetch();
      message.success("PDF обновлён");
    } catch (err) {
      console.error(err);
      message.error("Ошибка загрузки PDF");
    }
  };

  const previewUrl = tempUrl || notePdf?.notePdfLink;

  return (
    <div>
      <Title level={3}>Ноты (PDF)</Title>
      <Divider />

      <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
        <Button
          icon={<PlusOutlined />}
          type="dashed"
          onClick={() => fileInputRef.current.click()}
        >
          {previewUrl ? "Заменить PDF" : "Загрузить PDF"}
        </Button>
        <Button icon={<SyncOutlined />} onClick={handleReset} disabled={!file}>
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
        {previewUrl && (
          <Button icon={<DeleteOutlined />} danger onClick={handleRemove} />
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="application/pdf"
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
      </div>

      {previewUrl && (
        <iframe
          src={previewUrl}
          width="100%"
          height="600px"
          title="PDF Preview"
          style={{ border: "1px solid #ccc", borderRadius: 8 }}
        />
      )}
    </div>
  );
};

export default Note;
