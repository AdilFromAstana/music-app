import { PlayCircleOutlined, PauseCircleOutlined } from "@ant-design/icons";
import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { Typography, Skeleton } from "antd";
import ComposerHeader from "../../../components/ComposerHeader";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getComposerById } from "../../../firebase/composers";
import { useLanguage } from "../../../context/LanguageContext";

const { Title } = Typography;

const ComposerDetailPage = () => {
  const { id } = useParams();
  const { language } = useLanguage();
  const queryClient = useQueryClient();
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

  const bioKey = `${language}Bio`;
  const bioAudioKey = `${language}AudioBio`;
  const bioText = composer[bioKey] || "";
  const bioAudio = composer[bioAudioKey] || "";

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
              display: bioAudio ? "flex" : "none",
              alignItems: "center",
            }}
          >
            <audio ref={audioRef} src={bioAudio} />
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
            value={bioText}
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
