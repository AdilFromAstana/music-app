import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Upload,
  message,
  Switch,
  Space,
  Tag,
} from "antd";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getAudiosByComposer,
  deleteAudio,
  toggleAudioStatus,
  createAudio,
  updateAudio,
} from "../../../../../firebase/audio";
import {
  UploadOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { useState } from "react";

const SupplierPerformerSongsTab = ({ supplierPerformerId }) => {
  const queryClient = useQueryClient();
  const [form] = Form.useForm();
  const [isCreating, setIsCreating] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingAudio, setEditingAudio] = useState(null);
  const [isStatusChanging, setIsStatusChanging] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const success = ({ message = "Успех" }) => {
    messageApi.open({
      type: "success",
      content: message,
    });
  };

  const error = ({ message = "Ошибка" }) => {
    messageApi.open({
      type: "error",
      content: message,
    });
  };

  const { data: audios = [], isLoading } = useQuery({
    queryKey: ["audios", supplierPerformerId],
    queryFn: () => getAudiosByComposer(supplierPerformerId),
  });

  const showModal = (audio = null) => {
    setEditingAudio(audio);
    form.setFieldsValue({
      title: audio?.title || "",
      audioFile: undefined,
    });
    setIsModalVisible(true);
  };

  const handleSave = async () => {
    try {
      setIsCreating(true);
      const values = await form.validateFields();

      const file = values.audioFile?.file;

      if (!file && !editingAudio) {
        error({ message: "Файл обязателен" });
        return;
      }

      if (editingAudio) {
        // 🔄 Обновление
        await updateAudio(editingAudio.id, {
          text: values.title,
        });
        success({ message: "Аудио обновлено" });
      } else {
        // ➕ Создание
        const newAudio = {
          composerId: supplierPerformerId,
          text: values.title,
          file,
        };
        await createAudio(newAudio);
        success({ message: "Аудио добавлено" });
      }

      queryClient.invalidateQueries(["audios", supplierPerformerId]);
      form.resetFields();
      setIsModalVisible(false);
    } catch (err) {
      console.error(err)
      error({ message: "Ошибка при сохранении" });
    } finally {
      setIsCreating(false);
    }
  };

  const handleDelete = (audioId) => {
    Modal.confirm({
      title: "Удалить аудио?",
      onOk: async () => {
        try {
          await deleteAudio(audioId);
          message.success("Удалено");
          queryClient.invalidateQueries(["audios", supplierPerformerId]);
        } catch {
          message.error("Ошибка удаления");
        }
      },
    });
  };

  const handleToggleStatus = async (audioId) => {
    try {
      setIsStatusChanging(true);
      await toggleAudioStatus(audioId);
      queryClient.invalidateQueries(["audios", supplierPerformerId]);
      success({ message: "Статус успешно обновлен!" });
    } catch {
      message.error("Ошибка статуса");
    } finally {
      setIsStatusChanging(false);
    }
  };

  const columns = [
    {
      title: "Название",
      dataIndex: "title",
      width: 400,
    },
    {
      title: "Ссылка",
      dataIndex: "audioLink",
      render: (audio) => (
        <audio src={audio} controls style={{ width: "100%" }} />
      ),
      width: 400,
    },
    {
      title: "Действия",
      render: (_, record) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            onClick={() => showModal(record)}
            size="small"
          />
          <Button
            icon={<DeleteOutlined />}
            danger
            onClick={() => handleDelete(record.id)}
            size="small"
          />
        </Space>
      ),
      width: 100,
    },
  ];

  return (
    <div>
      {contextHolder}
      <div style={{ marginBottom: 16 }}>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => showModal()}
        >
          Добавить аудио
        </Button>
      </div>

      <Table
        dataSource={audios}
        columns={columns}
        rowKey="id"
        loading={isLoading}
        pagination={false}
      />

      <Modal
        title={editingAudio ? "Редактировать аудио" : "Добавить аудио"}
        open={isModalVisible}
        cancelText="Отмена"
        onCancel={() => setIsModalVisible(false)}
        onOk={handleSave}
        okButtonProps={{
          loading: isCreating,
        }}
        okText="Сохранить"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="title"
            label="Название"
            rules={[{ required: true, message: "Введите название" }]}
          >
            <Input />
          </Form.Item>
          {!editingAudio && (
            <Form.Item
              name="audioFile"
              label="Аудио файл"
              getValueFromEvent={(e) => e}
              valuePropName="file"
              rules={
                editingAudio
                  ? []
                  : [{ required: true, message: "Выберите файл" }]
              }
            >
              <Upload beforeUpload={() => false} maxCount={1} accept="audio/*">
                <Button icon={<UploadOutlined />}>Загрузить</Button>
              </Upload>
            </Form.Item>
          )}
        </Form>
      </Modal>
    </div>
  );
};

export default SupplierPerformerSongsTab;
