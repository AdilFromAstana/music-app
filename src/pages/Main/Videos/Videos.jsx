import { useEffect, useState } from "react";
import { Input, Row, Col, Empty } from "antd";
const { Search } = Input;
import "./Videos.scss";
import { Link } from "react-router-dom";
import { getVideos } from "../../../firebase";

const getYouTubeId = (url) => {
  const match = url.match(/[?&]v=([^&]+)/);
  return match ? match[1] : null;
};

const getYouTubeThumbnail = (url) => {
  const videoId = getYouTubeId(url);
  return videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : "";
};

const highlightMatches = (text, searchTerm) => {
  if (!searchTerm || !text) return text;

  const regex = new RegExp(`(${searchTerm})`, "gi");
  const parts = text.split(regex);

  return parts.map((part, index) =>
    part.toLowerCase() === searchTerm.toLowerCase() ? (
      <mark key={index} style={{ backgroundColor: "#ffeb3b", padding: 0 }}>
        {part}
      </mark>
    ) : (
      part
    )
  );
};

const Videos = () => {
  const [filtered, setFiltered] = useState([]);
  const [searchValue, setSearchValue] = useState(""); // Добавлено состояние для поискового запроса

  useEffect(() => {
    const fetchData = async () => {
      const videos = await getVideos();
      setFiltered(videos);
    };

    fetchData();
  }, []);

  const onSearch = async (value) => {
    setSearchValue(value); // Сохраняем поисковый запрос
    const result = await getVideos(value);
    setFiltered(result);
  };

  return (
    <div className="youtube-container">
      <Search
        placeholder="Іздеу..."
        enterButton="Іздеу"
        size="large"
        allowClear
        onSearch={onSearch}
        style={{ marginBottom: 24, maxWidth: 500 }}
      />

      {filtered.length > 0 ? (
        <Row gutter={[12, 24]}>
          {filtered.map((video) => (
            <Col xs={24} sm={24} md={12} xl={8} xll={6} key={video.id}>
              <Link to={`/videos/${video.id}`} className="youtube-card">
                <div className="thumbnail-wrapper">
                  <img src={getYouTubeThumbnail(video.url)} alt={video.title} />
                </div>
                {/* Убрал дублирующий h4 и оставил только с подсветкой */}
                <h4>{highlightMatches(video.title, searchValue)}</h4>
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

export default Videos;
