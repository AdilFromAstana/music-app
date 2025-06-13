import { useEffect, useState } from "react";
import { Button, Typography, Spin, List, Avatar, Row, Col, Space } from "antd";
import { useNavigate, useParams, Link } from "react-router-dom";
import { getVideoById, getPaginatedVideos } from "../../../firebase/video"; // Убедись, что getPaginatedVideos есть
import "./Videos.scss";
import { LeftOutlined } from "@ant-design/icons";

const { Title } = Typography;

const getYouTubeId = (url) => {
  const match = url.match(/v=([^&]+)/);
  return match ? match[1] : "";
};

const getYouTubeThumbnail = (url) => {
  const id = getYouTubeId(url);
  return `https://img.youtube.com/vi/${id}/mqdefault.jpg`;
};

const VideosDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [video, setVideo] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [lastDoc, setLastDoc] = useState(null);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const currentVideo = await getVideoById(id);
      setVideo(currentVideo);

      const { videos, lastVisible } = await getPaginatedVideos(10);
      const filtered = videos.filter((v) => v.id !== id);
      setRecommendations(filtered);
      setLastDoc(lastVisible);
    };

    fetchData();
  }, [id]);

  const loadMore = async () => {
    if (!lastDoc || loadingMore) return;
    setLoadingMore(true);
    const { videos, lastVisible } = await getPaginatedVideos(10, lastDoc);
    const filtered = videos.filter((v) => v.id !== id);
    setRecommendations((prev) => [...prev, ...filtered]);
    setLastDoc(lastVisible);
    setLoadingMore(false);
  };

  useEffect(() => {
    const container = document.getElementById("recommendation-scroll");

    const handleScroll = () => {
      if (
        container.scrollTop + container.clientHeight >=
        container.scrollHeight - 100
      ) {
        loadMore();
      }
    };

    container?.addEventListener("scroll", handleScroll);
    return () => container?.removeEventListener("scroll", handleScroll);
  }, [lastDoc, id]);

  if (!video) {
    return (
      <div style={{ padding: 24, textAlign: "center" }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <Row gutter={[32, 32]} style={{ width: "85%", margin: "0px auto" }}>
      <Col xs={24} md={16}>
        <Space direction="vertical" style={{ width: "100%" }} size={24}>
          <Space direction="horizontal" size={24}>
            <Button
              type="default"
              onClick={() => navigate(-1)}
              icon={<LeftOutlined />}
            />

            <div style={{ fontSize: 24 }}>{video.title}</div>
          </Space>

          <div
            style={{
              borderRadius: 12,
              overflow: "hidden",
              boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
              marginBottom: 16,
            }}
          >
            <iframe
              width="100%"
              height="500"
              src={`https://www.youtube.com/embed/${getYouTubeId(video.url)}`}
              frameBorder="0"
              allowFullScreen
              title={video.title}
            />
          </div>
        </Space>
      </Col>

      <Col xs={24} md={8}>
        <Title level={5}>Рекомендуемые видео</Title>
        <div
          id="recommendation-scroll"
          style={{
            maxHeight: "600px",
            overflowY: "auto",
            paddingRight: 8,
          }}
        >
          <List
            itemLayout="horizontal"
            dataSource={recommendations}
            renderItem={(item) => (
              <List.Item>
                <List.Item.Meta
                  avatar={
                    <Link to={`/videos/${item.id}`}>
                      <Avatar
                        shape="square"
                        size={80}
                        src={getYouTubeThumbnail(item.url)}
                      />
                    </Link>
                  }
                  title={
                    <Link to={`/videos/${item.id}`} style={{ color: "#333" }}>
                      {item.title}
                    </Link>
                  }
                  description={item.channel}
                />
              </List.Item>
            )}
          />
          {loadingMore && (
            <div style={{ textAlign: "center", padding: 12 }}>
              Загрузка ещё...
            </div>
          )}
        </div>
      </Col>
    </Row>
  );
};

export default VideosDetail;
