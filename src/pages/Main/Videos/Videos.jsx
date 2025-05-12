import { useState } from "react";
import { Input, Row, Col, Card, Empty } from "antd";
const { Search } = Input;
import "./Videos.scss";
import { Link } from "react-router-dom";
import { videos } from "../../../data/items";

const getYouTubeId = (url) => {
  const match = url.match(/[?&]v=([^&]+)/);
  return match ? match[1] : null;
};

const getYouTubeThumbnail = (url) => {
  const videoId = getYouTubeId(url);
  return videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : "";
};

const Vidoes = () => {
  const [query, setQuery] = useState("");
  const [filtered, setFiltered] = useState(videos);

  const onSearch = (value) => {
    const q = value.toLowerCase();
    const result = videos.filter((v) => v.title.toLowerCase().includes(q));
    setFiltered(result);
  };

  return (
    <div className="youtube-container">
      <Search
        placeholder="Найти видео..."
        enterButton="Поиск"
        size="large"
        onSearch={onSearch}
        allowClear
        style={{ marginBottom: 24, maxWidth: 500 }}
      />

      {filtered.length > 0 ? (
        <Row gutter={[12, 24]}>
          {filtered.map((video) => (
            <Col xs={24} sm={24} md={12} xl={8} xll={6} key={video.id}>
              <Link
                to={`/videos/${video.id}`}
                key={video.id}
                className="youtube-card"
              >
                <div className="thumbnail-wrapper">
                  <img src={getYouTubeThumbnail(video.url)} alt={video.title} />
                </div>
                <h4>{video.title}</h4>
              </Link>
            </Col>
          ))}
        </Row>
      ) : (
        <Empty description="Видео не найдено" />
      )}
    </div>
  );
};

export default Vidoes;
