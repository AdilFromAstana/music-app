import {
  Table,
  Button,
  Form,
  Upload,
  message,
  Switch,
  Space,
  Tag,
  Divider,
  Typography,
  Row,
  Col,
  Card,
  Image,
} from "antd";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import {
  UploadOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  ArrowLeftOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import { getAudiosByComposer } from "../../../firebase";
import { DndContext } from "@dnd-kit/core";
import { arrayMove, SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const { Title } = Typography;

// Компонент сортируемой карточки
const SortableItem = ({ id, children }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    cursor: "move",
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Card
        style={{
          width: "100%",
          aspectRatio: "1/1",
          position: "relative",
          overflow: "hidden",
        }}
        cover={
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {children}
          </div>
        }
      ></Card>
    </div>
  );
};

const ComposerNoteTable = ({
  showModal,
  columns,
  isLoading,
  audios,
  onRowClick,
}) => {
  return (
    <>
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
        onRow={(record) => ({
          onClick: () => onRowClick(record),
        })}
      />
    </>
  );
};

const SongDetails = ({ song, onBack }) => {
  const [notes, setNotes] = useState([
    {
      id: 1,
      url: "https://shjest-strun.ru/wp-content/uploads/4/3/8/4387d441b0ce703ad8f4c8876945fe0b.jpeg",
      isCover: true,
    },
    {
      id: 2,
      url: "https://www.digiseller.ru/preview/197306/p1_40721200422273.GIF",
    },
    {
      id: 3,
      url: "https://www.digiseller.ru/preview/197306/p1_2973937_6fea0385.gif",
    },
  ]);

  const [fileList, setFileList] = useState([]);
  const [uploading, setUploading] = useState(false);

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setNotes((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleRemove = (id) => {
    setNotes(notes.filter((note) => note.id !== id));
  };

  const handleUpload = async () => {
    setUploading(true);
    try {
      // Здесь должна быть реальная логика загрузки на сервер
      // Например, через ваш API
      await new Promise((resolve) => setTimeout(resolve, 1000));
      message.success("Ноты успешно сохранены");
    } catch (error) {
      console.error("Ошибка при сохранении нот", error);
      message.error("Ошибка при сохранении нот");
    } finally {
      setUploading(false);
    }
  };

  const beforeUpload = (file) => {
    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      message.error("Можно загружать только изображения!");
      return Upload.LIST_IGNORE;
    }

    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      message.error("Изображение должно быть меньше 5MB!");
      return Upload.LIST_IGNORE;
    }

    return true;
  };

  const handleChange = (info) => {
    let newFileList = [...info.fileList];

    // Ограничение количества файлов
    newFileList = newFileList.slice(-9);

    // Чтение и отображение превью
    newFileList = newFileList.map((file) => {
      if (file.originFileObj) {
        file.url = URL.createObjectURL(file.originFileObj);
      }
      return file;
    });

    setFileList(newFileList);
  };

  const addNotesFromUpload = () => {
    const newNotes = fileList.map((file, index) => ({
      id: Date.now() + index, // Уникальный ID
      url: file.url,
    }));

    setNotes([...notes, ...newNotes]);
    setFileList([]);
    message.success(`Добавлено ${newNotes.length} изображений`);
  };

  return (
    <div
      style={{
        maxWidth: "800px",
        textAlign: "center",
        margin: "0 auto",
        width: "100%",
      }}
    >
      <Button
        icon={<ArrowLeftOutlined />}
        onClick={onBack}
        style={{ marginBottom: 16 }}
      >
        Назад к списку
      </Button>

      <Title level={2}>{song.title}</Title>

      <Divider />

      <div style={{ marginTop: 24, overflow: "hidden" }}>
        <Title level={4}>Ноты</Title>

        <DndContext onDragEnd={handleDragEnd}>
          <SortableContext items={notes.map((note) => note.id)}>
            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
              {notes.map((note, i) => (
                <Col xs={24} sm={12} md={8} key={note.id}>
                  <div style={{ position: "relative" }}>
                    <SortableItem id={note.id} onRemove={null}>
                      <Image
                        src={note.url}
                        alt={`Ноты ${note.id}`}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          aspectRatio: "1/1",
                        }}
                        preview={{
                          maskClassName: "custom-preview-mask",
                        }}
                      />
                    </SortableItem>
                    <div
                      style={{
                        position: "absolute",
                        width: 32,
                        height: 32,
                        background: "white",
                        border: "1px solid black",
                        borderRadius: "10px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        top: 10,
                        left: 10,
                        zIndex: 2,
                      }}
                    >
                      {i + 1}
                    </div>
                    <Button
                      icon={<DeleteOutlined />}
                      style={{
                        position: "absolute",
                        width: 32,
                        height: 32,
                        background: "white",
                        border: "1px solid black",
                        borderRadius: "10px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        top: 10,
                        right: 10,
                        zIndex: 2,
                      }}
                      onClick={() => handleRemove(note.id)}
                    />
                  </div>
                </Col>
              ))}
            </Row>
          </SortableContext>
        </DndContext>

        <div style={{ marginTop: 24 }}>
          <Upload
            multiple
            listType="picture-card"
            fileList={fileList}
            beforeUpload={beforeUpload}
            onChange={handleChange}
            accept="image/*"
            showUploadList={{
              showPreviewIcon: true,
              showRemoveIcon: true,
            }}
            customRequest={({ onSuccess }) =>
              setTimeout(() => onSuccess("ok"), 0)
            }
          >
            {fileList.length >= 9 ? null : (
              <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Загрузить ноты</div>
              </div>
            )}
          </Upload>

          <div style={{ marginTop: 16 }}>
            <Button
              type="primary"
              onClick={addNotesFromUpload}
              disabled={fileList.length === 0}
              style={{ marginRight: 16 }}
            >
              Добавить к нотам
            </Button>

            <Button
              type="primary"
              onClick={handleUpload}
              disabled={notes.length === 0}
              loading={uploading}
            >
              {uploading ? "Сохранение..." : "Сохранить порядок"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ComposerNotesTab = ({ composerId }) => {
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingAudio, setEditingAudio] = useState(null);
  const [isStatusChanging, setIsStatusChanging] = useState(false);
  const [selectedSong, setSelectedSong] = useState(null);
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

  const handleRowClick = (song) => {
    setSelectedSong(song);
  };

  const handleBackToList = () => {
    setSelectedSong(null);
  };

  const columns = [
    {
      title: "Название",
      dataIndex: "title",
      width: 400,
    },
    {
      title: "Статус",
      dataIndex: "active",
      render: (value, record) => {
        return (
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Tag color={record?.active ? "green" : "red"}>
              {record?.active ? "Активный" : "Неактивный"}
            </Tag>
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
        <Button
          icon={<DeleteOutlined />}
          danger
          onClick={(e) => {
            e.stopPropagation();
            handleDelete(record.id);
          }}
          size="small"
        />
      ),
      width: 100,
    },
  ];

  return (
    <div>
      {contextHolder}
      {!selectedSong ? (
        <ComposerNoteTable
          showModal={showModal}
          columns={columns}
          isLoading={isLoading}
          audios={audios}
          onRowClick={handleRowClick}
        />
      ) : (
        <SongDetails song={selectedSong} onBack={handleBackToList} />
      )}
    </div>
  );
};

export default ComposerNotesTab;
