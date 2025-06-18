import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Upload,
  message,
  Space,
} from "antd";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getAudiosByComposer,
  deleteAudio,
  createAudio,
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
  const [isBulkMode, setIsBulkMode] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);

  const { data: audios = [], isLoading } = useQuery({
    queryKey: ["audios", supplierPerformerId],
    queryFn: () => getAudiosByComposer(supplierPerformerId),
  });

  const showModal = (audio = null) => {
    setEditingAudio(audio);
    setIsBulkMode(false);
    form.setFieldsValue({
      title: audio?.title || "",
      audioFile: undefined,
    });
    setIsModalVisible(true);
  };

  const handleBulkUpload = async () => {
    if (!selectedFiles.length) return;

    setUploading(true);
    const results = await Promise.allSettled(
      selectedFiles.map((file) => {
        const baseName = file.name.replace(/\\.[^/.]+$/, "");
        return createAudio({
          composerId: supplierPerformerId,
          text: baseName,
          file,
        })
          .then(() => ({
            name: file.name,
            status: "✅ Успешно",
          }))
          .catch(() => ({
            name: file.name,
            status: "❌ Ошибка",
          }));
      })
    );

    await queryClient.invalidateQueries(["audios", supplierPerformerId]);
    setUploading(false);
    setIsModalVisible(false);
    setSelectedFiles([]);

    messageApi.open({
      type: "info",
      content: (
        <div>
          <b>Результаты загрузки:</b>
          <ul style={{ marginTop: 8 }}>
            {results.map((r, idx) => (
              <li key={idx}>
                {r.status === "fulfilled"
                  ? r.value.status + " — " + r.value.name
                  : r.reason?.message || "❌ Ошибка"}
              </li>
            ))}
          </ul>
        </div>
      ),
      duration: 8,
    });
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

  const columns = [
    {
      title: "Название",
      dataIndex: "title",
      width: 400,
      sorter: (a, b) => a.title.localeCompare(b.title),
      defaultSortOrder: "ascend",
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
      <div style={{ marginBottom: 16, display: "flex", gap: 8 }}>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => showModal()}
        >
          Добавить аудио
        </Button>
        <Button
          onClick={() => {
            setIsBulkMode(true);
            setIsModalVisible(true);
          }}
        >
          Массовая загрузка
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
        title={isBulkMode ? "Массовая загрузка" : "Добавить аудио"}
        open={isModalVisible}
        cancelText="Отмена"
        onCancel={() => {
          setIsModalVisible(false);
          setSelectedFiles([]);
        }}
        footer={
          isBulkMode
            ? [
                <Button
                  key="upload"
                  type="primary"
                  loading={uploading}
                  onClick={handleBulkUpload}
                  disabled={!selectedFiles.length}
                >
                  Начать загрузку
                </Button>,
              ]
            : undefined
        }
      >
        <Form form={form} layout="vertical">
          {isBulkMode ? (
            <Form.Item label="Массовая загрузка">
              <Upload
                multiple
                accept="audio/*"
                fileList={selectedFiles.map((file, index) => ({
                  uid: index.toString(),
                  name: file.name,
                }))}
                beforeUpload={() => false}
                showUploadList
                onChange={(info) => {
                  const files = info.fileList
                    .map((f) => f.originFileObj)
                    .filter(Boolean);
                  setSelectedFiles(files);
                }}
              >
                <Button icon={<UploadOutlined />}>
                  Выбрать несколько аудиофайлов
                </Button>
              </Upload>
            </Form.Item>
          ) : (
            <>
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
                  rules={[{ required: true, message: "Выберите файл" }]}
                >
                  <Upload
                    beforeUpload={() => false}
                    maxCount={1}
                    accept="audio/*"
                  >
                    <Button icon={<UploadOutlined />}>Загрузить</Button>
                  </Upload>
                </Form.Item>
              )}
            </>
          )}
        </Form>
      </Modal>
    </div>
  );
};

export default SupplierPerformerSongsTab;
