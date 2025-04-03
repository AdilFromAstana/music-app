import { PlayCircleOutlined, PauseCircleOutlined } from "@ant-design/icons";
import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { Typography, Skeleton } from "antd";
import ComposerHeader from "../../components/ComposerHeader";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getComposerById } from "../../firebase";

const { Title } = Typography;

const ComposerDetailPage = () => {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const textareaRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);
  const audioUrl =
    // "https://drive.google.com/file/d/1wDkuKCKLRXDswx0AatC6GWwTr-RHyuuF/view?usp=drive_link";
    "https://ia600703.us.archive.org/9/items/20250326_20250326_1402/%D0%90%D0%B4%D0%B0%D1%81%D2%9B%D0%B0%D2%9B%20%28%D0%91%D1%96%D1%80%D0%B6%D0%B0%D0%BD%20%D1%81%D0%B0%D0%BB%29-%D0%A8%D2%AF%D0%BA%D1%96%D0%BC%D0%B0%D0%BD%D0%BE%D0%B2%20%D0%95%D1%80%D0%BA%D1%96%D0%BD.mp3";

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

  const { data: composer = {}, isLoading } = useQuery({
    queryKey: ["composer", id],
    queryFn: async ({ queryKey }) => {
      const [, params] = queryKey;

      const cachedData = queryClient.getQueryData(["composer", params]);
      if (cachedData) {
        return cachedData;
      }

      return getComposerById(params);
    },
    keepPreviousData: true,
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
  });

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        textareaRef.current.scrollHeight + "px";
    }
  }, [composer?.bio]);

  if (!composer) {
    return <Title level={2}>Композитор не найден</Title>;
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
      <ComposerHeader composer={composer} isLoading={isLoading} />
      <div>
        <div
          style={{
            position: "relative",
            display: "flex",
            justifyContent: "center",
          }}
        >
          {isLoading ? (
            <Skeleton.Input active size="small" style={{ width: 300 }} />
          ) : (
            <div style={{ fontSize: 20 }}>Биография</div>
          )}
          <div
            style={{
              position: "absolute",
              right: 0,
              top: 0,
              display: isLoading ? "none" : "flex",
              alignItems: "center",
            }}
          >
            <audio ref={audioRef} src={audioUrl} />
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
        {isLoading ? (
          <>
            <Skeleton active />
            <Skeleton active />
            <Skeleton active />
            <Skeleton active />
          </>
        ) : (
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
        )}
      </div>
    </div>
  );
};

export default ComposerDetailPage;
