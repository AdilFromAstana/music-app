import {
  HomeOutlined,
  FileTextOutlined,
  BookOutlined,
  UsergroupAddOutlined,
  StarOutlined,
  PlayCircleOutlined,
  AudioOutlined,
  VideoCameraOutlined,
  FilePdfOutlined,
  CheckCircleOutlined,
  ReadOutlined,
} from "@ant-design/icons";

export const items = [
  { key: "/", label: "Арқа әншілік мектебі", icon: <HomeOutlined /> },
  { key: "/introduction", label: "Кіріспе", icon: <FileTextOutlined /> },
  {
    key: "/formationOfTraditionalSongArt",
    label: "⁠Дәстүрлі ән өнерінің қалыптасуы",
    icon: <BookOutlined />,
  },
  {
    key: "/stagesOfMentoringStudent",
    label: "⁠Шәкірт тәрбиелеу кезеңдері",
    icon: <UsergroupAddOutlined />,
  },
  {
    key: "/composers",
    label: "⁠Халық композиторлары",
    icon: <StarOutlined />,
  },
  {
    key: "/supplierPerformers",
    label: "⁠Жеткізуші орындаушылар",
    icon: <PlayCircleOutlined />,
  },
  { key: "/recordings", label: "⁠Аудиожазбалар", icon: <AudioOutlined /> },
  { key: "/videos", label: "⁠Бейнежазбалар", icon: <VideoCameraOutlined /> },
  { key: "/composersNotes", label: "⁠Ноталар", icon: <FilePdfOutlined /> },
  { key: "/conclusion", label: "⁠Қорытынды", icon: <CheckCircleOutlined /> },
  { key: "/literature", label: "⁠Әдебиеттер", icon: <ReadOutlined /> },
];

export const adminItems = [
  { key: "/composers", label: "⁠Халық композиторлары" },
  { key: "/supplierPerformers", label: "⁠Жеткізуші орындаушылар" },
  { key: "/notes", label: "Ноталар" },
];
