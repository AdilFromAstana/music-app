import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { Skeleton, Typography, Input, Empty } from "antd";
import ComposerHeader from "../../../components/ComposerHeader";
import { getAudiosByComposer, getComposerById } from "../../../firebase";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const { Title } = Typography;
const { Search } = Input;

// Функция для подсветки совпадений
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

const RecordingDetailPage = () => {
  const queryClient = useQueryClient();
  const { id } = useParams();
  const textareaRef = useRef(null);
  const audioRefs = useRef([]);
  const [audioTimes, setAudioTimes] = useState({});
  const [searchValue, setSearchValue] = useState(""); // Состояние для поиска
  const [filteredAudios, setFilteredAudios] = useState([]); // Отфильтрованные аудио

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

  // Фильтрация аудио при изменении поискового запроса или данных
  useEffect(() => {
    if (searchValue) {
      const filtered = audios.filter((audio) =>
        audio.title.toLowerCase().includes(searchValue.toLowerCase())
      );
      setFilteredAudios(filtered);
    } else {
      setFilteredAudios(audios);
    }
  }, [searchValue, audios]);

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
        const id = filteredAudios[index]?.id;
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

  const handleSearch = (value) => {
    setSearchValue(value.trim());
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

      {/* Добавлен поиск */}
      <Search
        placeholder="Аудио іздеу..."
        enterButton="Іздеу"
        size="large"
        allowClear
        onSearch={handleSearch}
        style={{ marginBottom: 16 }}
      />

      {isAudioLoading ? (
        <>
          <Skeleton active />
          <Skeleton active />
          <Skeleton active />
        </>
      ) : filteredAudios.length > 0 ? (
        filteredAudios.map((audio, index) => {
          const audioId = audio.id || index.toString();
          return (
            <div key={audioId}>
              {/* Добавлена подсветка совпадений в названии */}
              <b>{highlightMatches(audio.title, searchValue)}</b>
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
        <Empty
          description={searchValue ? "Аудио табылмады" : "АУДИОЖАЗБАЛАР ЖОК"}
        />
      )}
    </div>
  );
};

export default RecordingDetailPage;
