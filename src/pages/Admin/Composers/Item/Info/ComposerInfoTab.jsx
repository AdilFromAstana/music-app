import { useState } from "react";
import { Button, Col, Form, message } from "antd";
import {
  updateComposer,
  composerAudioBio,
} from "../../../../../firebase/composers";
import LanguageSwitcher from "./components/LanguageSwitcher";
import LocalizedInput from "./components/LocalizedInput";
import LocalizedTextarea from "./components/LocalizedTextarea";
import YearsInput from "./components/YearsInput";
import AudioBioUploader from "./components/AudioBioUploader";

const ComposerInfoTab = ({ composerId, composer, form, setComposer }) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState("ru");

  const handleCancel = () => {
    setIsEditMode(false);
    form.setFieldsValue(composer);
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const values = form.getFieldsValue(true);
      const updated = await updateComposer(composerId, values);
      setComposer(updated);
      form.setFieldsValue(updated);
      setIsEditMode(false);
      message.success("Данные обновлены!");
    } catch (error) {
      console.error("Ошибка при обновлении:", error);
      message.error("Ошибка при обновлении");
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (file, lang) => {
    try {
      setLoading(true);
      const audioUrl = await composerAudioBio({ composerId, file, lang });
      form.setFieldValue(`${lang}AudioBio`, audioUrl);
      message.success(`Аудио (${lang.toUpperCase()}) загружено!`);
    } catch (e) {
      console.error(e);
      message.error("Ошибка при загрузке аудио");
    } finally {
      setLoading(false);
    }
  };

  if (!composer) return "Загрузка...";

  return (
    <Form form={form} layout="vertical" onFinish={handleSave}>
      <LanguageSwitcher language={language} setLanguage={setLanguage} />
      <LocalizedInput language={language} isEditMode={isEditMode} />
      <YearsInput isEditMode={isEditMode} />
      <LocalizedTextarea language={language} isEditMode={isEditMode} />
      <AudioBioUploader
        key={language}
        composerId={composerId}
        language={language}
        form={form}
        isEditMode={isEditMode}
        onUpload={handleUpload}
      />

      <div style={{ display: "flex", gap: 10 }}>
        {isEditMode ? (
          <>
            <Button type="primary" loading={loading} onClick={handleSave}>
              Сохранить
            </Button>
            <Button onClick={handleCancel}>Отмена</Button>
          </>
        ) : (
          <Button onClick={() => setIsEditMode(true)}>Редактировать</Button>
        )}
      </div>
    </Form>
  );
};

export default ComposerInfoTab;
