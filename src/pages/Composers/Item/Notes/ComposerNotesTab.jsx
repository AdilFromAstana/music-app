import { Button, Form, message, Switch, Tag } from "antd";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { DeleteOutlined } from "@ant-design/icons";
import { getAudiosByComposer } from "../../../../firebase";
import { ComposerNoteTable } from "./ComposerNoteTable";
import { SongDetails } from "./SongDetails";

const ComposerNotesTab = ({ composerId }) => {
  const [selectedSong, setSelectedSong] = useState(null);
  const [isStatusChanging, setIsStatusChanging] = useState(false);
  const queryClient = useQueryClient();
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
