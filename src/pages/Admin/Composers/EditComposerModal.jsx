import { Modal, Form, Input, Button, Col, message } from "antd";
import { useEffect, useState } from "react";
import { updateComposer } from "../../../firebase";

const EditComposerModal = ({
  queryData,
  setSelectedRecord,
  queryClient,
  open,
  onClose,
  record,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const handleCancel = () => {
    setIsEditMode(false);
    form.setFieldsValue({
      title: record.title,
    });
  };
  
  console.log("record: ", record);

  const handleChangeStatus = async () => {
    setLoading(true);
    try {
      const updatedData = await updateComposer(record.id, {
        active: !record.active,
      });
      queryClient.setQueryData(["cities", queryData], (oldData) => {
        console.log("oldData: ", oldData);
        if (!oldData) return oldData;
        return oldData.map((item) => {
          if (item.id == record.id) {
            setSelectedRecord(updatedData);
            form.setFieldsValue(updatedData);
            return updatedData;
          } else {
            return item;
          }
        });
      });
      message.success("Запись успешно обновлена!");
      onClose();
    } catch (error) {
      message.error(
        `Ошибка: ${error?.response?.data?.message || "Неизвестная ошибка"}`
      );
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    try {
      setLoading(true);

      const updatedData = await updateComposer(
        record.id,
        form.getFieldsValue()
      );

      queryClient.setQueryData(["cities", queryData], (oldData) => {
        console.log("oldData: ", oldData);
        if (!oldData) return oldData;
        return oldData.map((item) => {
          console.log("item: ", item);
          if (item.id == record.id) {
            setSelectedRecord(updatedData);
            form.setFieldsValue(updatedData);
            return updatedData;
          } else {
            return item;
          }
        });
      });

      message.success("🎉 Город успешно обновлен!");

      setIsEditMode(false);
      onClose();
    } catch (error) {
      console.error("❌ Ошибка при обновлении:", error);
      message.error(
        `Ошибка при обновлении: ${
          error.response?.data?.message || "Неизвестная ошибка"
        }`
      );
    } finally {
      setLoading(false);
      console.log("🔽 Завершение обновления.");
    }
  };

  useEffect(() => {
    if (open && record) {
      form.setFieldsValue({
        ...record,
      });
    }
  }, [open, record]);

  return (
    <Modal
      open={open}
      onCancel={onClose}
      title={isEditMode ? "Редактировать город" : "Просмотр города"}
      footer={null}
      closeIcon={false}
      maskClosable={false}
    >
      <Form form={form} layout="vertical" onFinish={handleUpdate}>
        <Col span={24}>
          <Form.Item
            name="name"
            label="name"
            rules={[{ required: true, message: "Введите name" }]}
          >
            <Input disabled={!isEditMode} />
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item
            name="years"
            label="years"
            rules={[{ required: true, message: "Введите years" }]}
          >
            <Input disabled={!isEditMode} />
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item
            name="bio"
            label="bio"
            rules={[{ required: true, message: "Введите bio" }]}
          >
            <Input.TextArea disabled={!isEditMode} rows={10} />
          </Form.Item>
        </Col>

        <div style={{ display: "flex", gap: 10 }}>
          {isEditMode ? (
            <>
              <Button type="primary" onClick={handleUpdate} loading={loading}>
                Сохранить
              </Button>
              <Button type="default" onClick={handleCancel}>
                Отмена
              </Button>
            </>
          ) : (
            <>
              <Button type="primary" onClick={() => setIsEditMode(true)}>
                Редактировать
              </Button>
              <Button
                type="primary"
                style={{ backgroundColor: record.active ? "red" : "green" }}
                onClick={handleChangeStatus}
              >
                {record.active ? "Архивировать" : "Активировать"}
              </Button>
              <Button danger onClick={onClose} style={{ marginLeft: "auto" }}>
                Закрыть
              </Button>
            </>
          )}
        </div>
      </Form>
    </Modal>
  );
};

export default EditComposerModal;
