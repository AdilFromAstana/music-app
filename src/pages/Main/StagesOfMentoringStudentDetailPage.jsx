import React, { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { Typography, Button } from "antd";
import { stages } from "../../data/studyStages";
import { LeftCircleOutlined } from "@ant-design/icons";
import { useLocation } from "react-router-dom";
import { items } from "../../data/items";

const { Title } = Typography;

const StagesOfMentoringStudentDetailPage = () => {
  const { id } = useParams();
  const { pathname } = useLocation();
  const prevPath = pathname.split("/").slice(0, -1).join("/");

  const getPrevPathTitle = () => {
    return items.find((item) => item.key === prevPath).label ?? "Назад";
  };
  const stage = stages.find((comp) => comp.id == id);
  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        textareaRef.current.scrollHeight + "px";
    }
  }, [stage.id]);

  if (!stage) {
    return <Title level={2}>Ноты не найдены</Title>;
  }

  return (
    <div
      style={{
        maxWidth: "800px",
        width: "100%",
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        gap: 20,
      }}
    >
      <div style={{ width: "100%" }}>
        <div
          style={{
            display: "flex",
            gap: 10,
            alignItems: "center",
            opacity: 0.7,
            cursor: "pointer",
            width: "fit-content",
          }}
          onClick={() => window.history.back()}
        >
          <LeftCircleOutlined style={{ fontSize: 14, cursor: "pointer" }} />
          <span style={{ fontSize: 16, cursor: "pointer" }}>
            {getPrevPathTitle()}
          </span>
        </div>
        <div style={{ position: "relative" }}>
          <div style={{ fontSize: 20 }}>{stage.title}</div>
          {/* <div
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
          </div> */}
        </div>
        <textarea
          ref={textareaRef}
          value={stage.content}
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
    </div>
  );
};

export default StagesOfMentoringStudentDetailPage;
