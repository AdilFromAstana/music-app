import { Modal, Form, Input, Button, Row, Col, message } from "antd";
import { useState } from "react";
import { createComposer } from "../../../../firebase";

const CreateComposerModal = ({ open, onClose, refreshData }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      console.log("🔄 Начало создания города...", values);

      const response = await createComposer(values);

      console.log("✅ Успешный ответ сервера:", response.data);
      message.success("🎉 Город успешно создан!");

      refreshData();
      onClose();
      form.resetFields(); // Очистка формы
    } catch (error) {
      console.error("❌ Ошибка при создании записи:", error);
      message.error(
        `Ошибка при создании: ${
          error.response?.data?.message || "Неизвестная ошибка"
        }`
      );
    } finally {
      setLoading(false);
      console.log("🔽 Завершение создания.");
    }
  };

  return (
    <Modal
      width="75vw"
      open={open}
      onCancel={onClose}
      title="Создать город"
      footer={null}
      maskClosable={false}
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              name="name"
              label="Город"
              rules={[{ required: true, message: "Введите название" }]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              name="title"
              label="Город"
              rules={[{ required: true, message: "Введите название" }]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              name="title"
              label="Город"
              rules={[{ required: true, message: "Введите название" }]}
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>

        <div style={{ display: "flex", gap: 10 }}>
          <Button type="primary" htmlType="submit" loading={loading}>
            Создать
          </Button>
          <Button type="default" danger onClick={onClose}>
            Закрыть
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default CreateComposerModal;
