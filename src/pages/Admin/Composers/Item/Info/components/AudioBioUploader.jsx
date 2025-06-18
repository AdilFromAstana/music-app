import { UploadOutlined } from "@ant-design/icons";
import { Upload, Button, Form, Col, message } from "antd";
import { deleteObject, ref } from "firebase/storage";
import { doc, updateDoc } from "firebase/firestore";
import { db, storage } from "../../../../../../firebase/firebase";

const AudioBioUploader = ({
  language,
  form,
  isEditMode,
  onUpload,
  composerId,
}) => {
  const audioField = `${language}AudioBio`;

  const handleDelete = async () => {
    const audioUrl = form.getFieldValue(audioField);
    try {
      if (!audioUrl) return;

      const filePath = `audios/${composerId}/${language}.mp3`;
      const fileRef = ref(storage, filePath);
      await deleteObject(fileRef);

      const composerRef = doc(db, "composers", composerId);
      await updateDoc(composerRef, {
        [audioField]: null,
      });

      form.setFieldValue(audioField, null);
      message.success(`Аудио (${language.toUpperCase()}) удалено`);
    } catch (error) {
      console.error("Ошибка при удалении аудио:", error);
      message.error("Не удалось удалить аудио");
    }
  };

  return (
    <Col span={24}>
      <Form.Item label={`Аудиобиография (${language.toUpperCase()})`}>
        {(() => {
          const currentUrl = form.getFieldValue(audioField);
          return (
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              {currentUrl ? (
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 8 }}
                >
                  <audio
                    controls
                    style={{
                      borderRadius: 6,
                      backgroundColor: "#f5f5f5",
                      width: 320,
                    }}
                  >
                    <source src={currentUrl} type="audio/mpeg" />
                    Ваш браузер не поддерживает аудио.
                  </audio>

                  <div style={{ display: "flex", gap: 8 }}>
                    <a
                      href={currentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      download
                    >
                      <Button type="default">Скачать</Button>
                    </a>
                    {isEditMode && (
                      <Button danger onClick={handleDelete}>
                        Удалить
                      </Button>
                    )}
                  </div>
                </div>
              ) : (
                <Upload
                  accept=".mp3"
                  maxCount={1}
                  showUploadList={false}
                  beforeUpload={(file) => {
                    onUpload(file, language);
                    return false;
                  }}
                >
                  <Button icon={<UploadOutlined />}>Загрузить аудио</Button>
                </Upload>
              )}
            </div>
          );
        })()}
      </Form.Item>
    </Col>
  );
};

export default AudioBioUploader;
