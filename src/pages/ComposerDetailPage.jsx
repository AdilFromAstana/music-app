import { PlayCircleOutlined, PauseCircleOutlined } from "@ant-design/icons";
import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { Typography, Button } from "antd";
import { composers } from "../data/composers";
import audio from "../data/audio.mp3";
import ComposerHeader from "../components/ComposerHeader";

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
        margin: "0 auto",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        gap: 20,
        background: "white",
        borderRadius: "10px",
        padding: 8,
      }}
    >
      <ComposerHeader composer={composer} />
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
          readOnly
          style={{
            fontFamily: "inherit",
            fontSize: 16,
            textAlign: "start",
            width: "100%",
            overflow: "hidden",
            resize: "none",
            background: "transparent",
            border: "transparent",
            outline: "none",
            cursor: "default",
          }}
        />
      </div>
    </div>
  );
};

export default ComposerDetailPage;
