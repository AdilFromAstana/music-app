import { useState } from "react";
import { Button, Form, message } from "antd";
import { updateSupplierPerformer } from "../../../../../firebase/supplierPerformers";
import LanguageSwitcher from "./components/LanguageSwitcher";
import LocalizedInput from "./components/LocalizedInput";
import LocalizedTextarea from "./components/LocalizedTextarea";
import YearsInput from "./components/YearsInput";

const SupplierPerformerInfoTab = ({
  supplierPerformerId,
  supplierPerformer,
  form,
  setSupplierPerformer,
}) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState("ru");

  const handleCancel = () => {
    setIsEditMode(false);
    form.setFieldsValue(supplierPerformer);
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const values = form.getFieldsValue(true);
      const updated = await updateSupplierPerformer(
        supplierPerformerId,
        values
      );
      setSupplierPerformer(updated);
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

  if (!supplierPerformer) return "Загрузка...";

  return (
    <Form form={form} layout="vertical" onFinish={handleSave}>
      <LanguageSwitcher language={language} setLanguage={setLanguage} />
      <LocalizedInput language={language} isEditMode={isEditMode} />
      <YearsInput isEditMode={isEditMode} />
      <LocalizedTextarea language={language} isEditMode={isEditMode} />

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

export default SupplierPerformerInfoTab;
