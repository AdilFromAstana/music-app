import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { Skeleton, Typography } from "antd";
import ComposerHeader from "../../../components/ComposerHeader";
import { getAudiosByComposer, getComposerById } from "../../../firebase";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const { Title } = Typography;

const RecordingDetailPage = () => {
  const queryClient = useQueryClient();
  const { id } = useParams();
  const textareaRef = useRef(null);
  const audioRefs = useRef([]);
  const [audioTimes, setAudioTimes] = useState({});

  const { data: composer = {}, isLoading } = useQuery({
    queryKey: ["composer", id],
    queryFn: async ({ queryKey }) => {
      const [, params] = queryKey;
      const cachedData = queryClient.getQueryData(["composer", params]);
      if (cachedData) return cachedData;
      return getComposerById(params);
    },
    keepPreviousData: true,
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
  });

  const { data: audios = [], isLoading: isAudioLoading } = useQuery({
    queryKey: ["audios", id],
    queryFn: async ({ queryKey }) => {
      const [, params] = queryKey;
      const cachedData = queryClient.getQueryData(["audios", params]);
      if (cachedData) return cachedData;
      return getAudiosByComposer(params);
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
  }, [composer.bio]);

  const handlePlay = (indexToPlay, audioId) => {
    audioRefs.current.forEach((audioRef, index) => {
      if (audioRef && index !== indexToPlay) {
        // Сохраняем время
        const id = audios[index]?.id;
        if (id) {
          setAudioTimes((prev) => ({
            ...prev,
            [id]: audioRef.currentTime,
          }));
        }
        audioRef.pause();
      }
    });

    // Восстановление времени, если есть
    const time = audioTimes[audioId];
    if (time && audioRefs.current[indexToPlay]) {
      audioRefs.current[indexToPlay].currentTime = time;
    }
  };

  const handleTimeUpdate = (index, audioId) => {
    const audioRef = audioRefs.current[index];
    if (audioRef) {
      setAudioTimes((prev) => ({
        ...prev,
        [audioId]: audioRef.currentTime,
      }));
    }
  };

  if (!composer) {
    return <Title level={2}>Музыка не найдена</Title>;
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
      {isAudioLoading ? (
        <>
          <Skeleton active />
          <Skeleton active />
          <Skeleton active />
        </>
      ) : audios.length > 0 ? (
        audios.map((audio, index) => {
          const audioId = audio.id || index.toString(); // гарантированный ID
          return (
            <div key={audioId}>
              <b>{audio.title}</b>
              <audio
                ref={(el) => (audioRefs.current[index] = el)}
                src={audio.audioLink}
                controls
                style={{ width: "100%" }}
                onPlay={() => handlePlay(index, audioId)}
                onTimeUpdate={() => handleTimeUpdate(index, audioId)}
              />
            </div>
          );
        })
      ) : (
        <Title>АУДИОЖАЗБАЛАР ЖОК</Title>
      )}
    </div>
  );
};

export default RecordingDetailPage;
