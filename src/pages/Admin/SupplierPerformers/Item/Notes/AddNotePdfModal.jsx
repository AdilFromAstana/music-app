import { useRef, useState } from "react";
import { Modal, Form, Input, Button, Upload, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { createNotePdf } from "../../../../firebase";

export const AddNotePdfModal = ({ open, onClose, composerId, onSuccess }) => {
  const [form] = Form.useForm();
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef(null);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      if (!fileRef.current) {
        return message.error("Выберите PDF-файл!");
      }

      setUploading(true);

      const id = await createNotePdf({
        composerId,
        text: values.title,
        file: fileRef.current,
      });

      message.success("Ноты успешно добавлены!");
      onSuccess?.(id);
      form.resetFields();
      fileRef.current = null;
      onClose();
    } catch (error) {
      console.error(error);
      message.error("Ошибка при добавлении нот");
    } finally {
      setUploading(false);
    }
  };

  const beforeUpload = (file) => {
    const isPdf = file.type === "application/pdf";
    const isLt10M = file.size / 1024 / 1024 < 10;

    if (!isPdf) {
      message.error("Можно загружать только PDF-файлы!");
      return Upload.LIST_IGNORE;
    }

    if (!isLt10M) {
      message.error("PDF должен быть меньше 10MB!");
      return Upload.LIST_IGNORE;
    }

    fileRef.current = file;
    return false; // не загружать автоматически
  };

  return (
    <Modal
      open={open}
      title="Добавить ноты"
      onCancel={onClose}
      onOk={handleSubmit}
      okText="Создать"
      confirmLoading={uploading}
    >
      <Form layout="vertical" form={form}>
        <Form.Item
          label="Название"
          name="title"
          rules={[{ required: true, message: "Введите название" }]}
        >
          <Input placeholder="Например: «Симфония №5»" />
        </Form.Item>

        <Form.Item label="Файл PDF">
          <Upload
            accept=".pdf"
            beforeUpload={beforeUpload}
            showUploadList={!!fileRef.current}
            maxCount={1}
          >
            <Button icon={<UploadOutlined />}>Выбрать PDF</Button>
          </Upload>
        </Form.Item>
      </Form>
    </Modal>
  );
};
