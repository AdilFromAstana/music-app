import { Typography, List, Input, Spin } from "antd";
import { Link } from "react-router-dom";
import { getSupplierPerformerByName } from "../../../firebase";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

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

const SupplierPerformersPage = () => {
  const [searchValue, setSearchValue] = useState("");

  const { data: supplierPerformers = [], isLoading } = useQuery({
    queryKey: ["supplierPerformers", { search: searchValue }],
    queryFn: () => getSupplierPerformerByName({ search: searchValue }),
    staleTime: 5 * 60 * 1000, // кеш 5 минут
    cacheTime: 10 * 60 * 1000, // данные держим в кеше 10 минут
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
      <Title level={2}>⁠ЖЕТКіЗУШі ОРЫНДАУШЫЛАР</Title>

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
          dataSource={supplierPerformers}
          renderItem={(supplierPerformer) => (
            <List.Item>
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 24,
                  width: "100%",
                  height: 200, // высота = высоте изображения
                }}
              >
                <img
                  src={supplierPerformer.image || "/placeholder.jpg"}
                  alt={supplierPerformer.name}
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
                    to={`/supplierPerformers/${supplierPerformer.id}`}
                    style={{
                      fontSize: 20,
                      fontWeight: 600,
                      display: "block",
                      marginBottom: 8,
                      color: "#000",
                      textDecoration: "none",
                    }}
                  >
                    {highlightMatches(supplierPerformer.name, searchValue)}
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
                      maxHeight: "4.5em", // 3 строки * line-height
                    }}
                  >
                    {supplierPerformer.bio}
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

export default SupplierPerformersPage;
