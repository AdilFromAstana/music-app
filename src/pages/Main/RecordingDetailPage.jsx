import React, { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { Skeleton, Typography } from "antd";
import ComposerHeader from "../../components/ComposerHeader";
import { getAudiosByComposer, getComposerById } from "../../firebase";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const { Title } = Typography;

const RecordingDetailPage = () => {
  const queryClient = useQueryClient();
  const { id } = useParams();
  const textareaRef = useRef(null);

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

  const { data: audios = [], isLoading: isAudioLoading } = useQuery({
    queryKey: ["audios", id],
    queryFn: async ({ queryKey }) => {
      const [, params] = queryKey;

      const cachedData = queryClient.getQueryData(["audios", params]);
      if (cachedData) {
        return cachedData;
      }

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
      <ComposerHeader composer={composer} />
      {isAudioLoading ? (
        <>
          <Skeleton active />
          <Skeleton active />
          <Skeleton active />
        </>
      ) : audios.length > 0 ? (
        audios.map((audio) => {
          return (
            <div>
              <b>{audio.title}</b>
              <audio
                src={audio.audioLink}
                controls
                style={{
                  width: "100%",
                }}
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
