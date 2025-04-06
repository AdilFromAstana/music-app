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
  uploadAudio,
  updateAudio,
  deleteAudio,
  toggleAudioStatus,
} from "../../../firebase";
import {
  UploadOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { useState } from "react";

const ComposerSongsTab = ({ composerId }) => {
  const queryClient = useQueryClient();
  const [form] = Form.useForm();
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

  const { data: audios = [], isLoading } = useQuery({
    queryKey: ["audios", composerId],
    queryFn: () => getAudiosByComposer(composerId),
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
    const values = await form.validateFields();
    const { title, audioFile } = values;

    try {
      let audioUrl = editingAudio?.audioLink;

      if (audioFile?.file) {
        const uploaded = await uploadAudio(audioFile.file.originFileObj);
        audioUrl = uploaded.downloadURL;
      }

      if (editingAudio) {
        await updateAudio(editingAudio.id, {
          title,
          audioLink: audioUrl,
        });
        message.success("Обновлено");
      } else {
        await uploadAudio(audioFile.file.originFileObj, {
          title,
          composerId,
        });
        message.success("Добавлено");
      }

      queryClient.invalidateQueries(["audios", composerId]);
      form.resetFields();
      setIsModalVisible(false);
    } catch (e) {
      console.error(e);
      message.error("Ошибка");
    }
  };

  const handleDelete = (audioId) => {
    Modal.confirm({
      title: "Удалить аудио?",
      onOk: async () => {
        try {
          await deleteAudio(audioId);
          message.success("Удалено");
          queryClient.invalidateQueries(["audios", composerId]);
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
      queryClient.invalidateQueries(["audios", composerId]);
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
      render: (text) => <audio src={text} controls style={{ width: "100%" }} />,
      width: 400,
    },
    {
      title: "Статус",
      dataIndex: "active",
      render: (value, record) => {
        console.log(record);
        return (
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Tag color={record?.active ? "green" : "red"}>Активный</Tag>
            <Switch
              loading={isStatusChanging}
              checked={value}
              onChange={() => handleToggleStatus(record.id)}
            />
          </div>
        );
      },
      width: 100,
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
        onCancel={() => setIsModalVisible(false)}
        onOk={handleSave}
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

export default ComposerSongsTab;
