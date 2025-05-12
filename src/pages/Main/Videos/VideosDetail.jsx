import { Button } from "antd";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { videos } from "../../../data/items";

const VideosDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const video = videos.find((v) => v.id === id);

  if (!video) {
    return <div style={{ padding: 24 }}>Видео не найдено</div>;
  }

  return (
    <div style={{ padding: 24 }}>
      <Button
        type="primary"
        onClick={() => navigate(-1)}
        style={{ marginBottom: 16 }}
      >
        ← Назад ко всем видео
      </Button>

      <h2>{video.title}</h2>
      <iframe
        width="100%"
        height="500"
        src={`https://www.youtube.com/embed/${getYouTubeId(video.url)}`}
        frameBorder="0"
        allowFullScreen
        title={video.title}
      />
      <p>{video.channel}</p>
    </div>
  );
};

const getYouTubeId = (url) => {
  const match = url.match(/v=([^&]+)/);
  return match ? match[1] : "";
};

export default VideosDetail;
