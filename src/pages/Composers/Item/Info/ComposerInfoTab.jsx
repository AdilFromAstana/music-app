import { useState } from "react";
import { Button, Col, Form, Input, message } from "antd";
import { updateComposer } from "../../../../firebase";

const ComposerInfoTab = ({ composerId, composer, form, setComposer }) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleCancel = () => {
    setIsEditMode(false);
    form.setFieldsValue(composer);
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const values = form.getFieldsValue();
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

  if (!composer) return "Загрузка...";

  return (
    <Form form={form} layout="vertical" onFinish={handleSave}>
      <Col span={24}>
        <Form.Item name="name" label="Имя" rules={[{ required: true }]}>
          <Input disabled={!isEditMode} />
        </Form.Item>
      </Col>
      <Col span={24}>
        <Form.Item name="years" label="Годы жизни" rules={[{ required: true }]}>
          <Input disabled={!isEditMode} />
        </Form.Item>
      </Col>
      <Col span={24}>
        <Form.Item name="bio" label="Биография" rules={[{ required: true }]}>
          <Input.TextArea rows={8} disabled={!isEditMode} />
        </Form.Item>
      </Col>

      <div style={{ display: "flex", gap: 10 }}>
        {isEditMode ? (
          <>
            <Button type="primary" htmlType="submit" loading={loading}>
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
