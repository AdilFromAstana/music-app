import { PlayCircleOutlined, PauseCircleOutlined } from "@ant-design/icons";
import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { Typography, Button } from "antd";
import { composers } from "../data/composers";
import audio from "../data/audio.mp3";

const { Title } = Typography;

const ComposerDetailPage = () => {
  const { id } = useParams();
  const composer = composers.find((comp) => comp.id == id);
  const textareaRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        textareaRef.current.scrollHeight + "px";
    }
  }, [composer.bio]);

  if (!composer) {
    return <Title level={2}>Ноты не найдены</Title>;
  }

  return (
    <div
      style={{
        maxWidth: "800px",
        display: "flex",
        flexDirection: "column",
        gap: 20,
      }}
    >
      <div
        style={{
          display: "grid",
          alignItems: "flex-start",
          gridTemplateColumns: "1fr 3fr",
        }}
      >
        <img
          src={composer.image}
          alt={composer.name}
          style={{ maxWidth: "100%", height: "250px", borderRadius: "10px" }}
        />
        <Title style={{ margin: 0 }} level={2}>
          {composer.name}
        </Title>
      </div>
      <div>
        <div style={{ position: "relative" }}>
          <div style={{ fontSize: 20 }}>Биография</div>
          <div
            style={{
              position: "absolute",
              right: 0,
              top: 0,
              display: "flex",
              alignItems: "center",
            }}
          >
            <audio ref={audioRef} src={audio} />
            {isPlaying ? (
              <PauseCircleOutlined
                style={{ fontSize: 24, cursor: "pointer" }}
                onClick={togglePlay}
              />
            ) : (
              <PlayCircleOutlined
                style={{ fontSize: 24, cursor: "pointer" }}
                onClick={togglePlay}
              />
            )}
          </div>
        </div>
        <textarea
          ref={textareaRef}
          value={composer.bio}
          readOnly // Запрещаем редактирование
          style={{
            fontFamily: "inherit",
            fontSize: 16,
            textAlign: "start",
            width: "100%",
            overflow: "hidden",
            resize: "none", // Отключаем ручное изменение размера
            border: "none", // Убираем рамку, если нужно
            background: "transparent", // Делаем фон прозрачным
            outline: "none", // Убираем контур при фокусе
            cursor: "default", // Делаем курсор обычным
          }}
        />
      </div>
      <Button type="primary" onClick={() => window.history.back()}>
        Назад
      </Button>
    </div>
  );
};

export default ComposerDetailPage;
