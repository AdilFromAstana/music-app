import { Typography, List, Input, Spin } from "antd";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { getComposersByName } from "../../../firebase/composers";

const { Title } = Typography;
const { Search } = Input;

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

const ComposersPage = () => {
  const [searchValue, setSearchValue] = useState("");

  const { data: composers = [], isLoading } = useQuery({
    queryKey: ["composers", { search: searchValue }],
    queryFn: () => getComposersByName({ search: searchValue }),
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
    keepPreviousData: true,
  });

  const handleSearch = (value) => {
    setSearchValue(value.trim());
  };

  return (
    <div
      style={{
        maxWidth: "1000px",
        textAlign: "center",
        margin: "0 auto",
        width: "100%",
        padding: "24px",
      }}
    >
      <Title level={2}>ХАЛЫҚ КОМПОЗИТОРЛАРЫ</Title>

      <Search
        placeholder="Іздеу..."
        enterButton="Іздеу"
        size="large"
        allowClear
        onSearch={handleSearch}
        style={{ marginBottom: 24, maxWidth: 500 }}
      />

      {isLoading ? (
        <Spin size="large" />
      ) : (
        <List
          itemLayout="horizontal"
          dataSource={composers}
          renderItem={(composer) => (
            <List.Item>
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 24,
                  width: "100%",
                  height: 200,
                }}
              >
                <img
                  src={composer.image || "/placeholder.jpg"}
                  alt={composer.name}
                  style={{
                    width: 200,
                    height: 200,
                    objectFit: "cover",
                    borderRadius: 8,
                    flexShrink: 0,
                  }}
                />
                <div
                  style={{ flex: 1, overflow: "hidden", textAlign: "start" }}
                >
                  <Link
                    to={`/composers/${composer.id}`}
                    style={{
                      fontSize: 20,
                      fontWeight: 600,
                      display: "block",
                      marginBottom: 8,
                      color: "#000",
                      textDecoration: "none",
                    }}
                  >
                    {highlightMatches(composer.name, searchValue)}
                  </Link>
                  <div
                    style={{
                      fontSize: 15,
                      color: "#555",
                      textAlign: "justify",
                      display: "-webkit-box",
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      lineHeight: "1.5em",
                      maxHeight: "4.5em",
                    }}
                  >
                    {composer.bio}
                  </div>
                </div>
              </div>
            </List.Item>
          )}
        />
      )}
    </div>
  );
};

export default ComposersPage;
