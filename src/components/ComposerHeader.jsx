import { LeftCircleOutlined } from "@ant-design/icons";
import { useLocation } from "react-router-dom";
import { Skeleton } from "antd";
import { items } from "../data/items";

const ComposerHeader = ({ composer, isLoading }) => {
  const { pathname } = useLocation();
  const prevPath = pathname.split("/").slice(0, -1).join("/");

  const getPrevPathTitle = () => {
    return items.find((item) => item.key === prevPath).label ?? "Назад";
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div
        style={{
          display: "flex",
          gap: 10,
          alignItems: "center",
          opacity: 0.7,
          cursor: "pointer",
          width: "fit-content",
        }}
        onClick={() => window.history.back()}
      >
        {isLoading ? (
          <Skeleton.Input active={true} size="small" />
        ) : (
          <>
            <LeftCircleOutlined style={{ fontSize: 14, cursor: "pointer" }} />
            <span style={{ fontSize: 16, cursor: "pointer" }}>
              {getPrevPathTitle()}
            </span>
          </>
        )}
      </div>
      <div
        style={{
          display: "grid",
          alignItems: "flex-start",
          gridTemplateColumns: "2fr 4fr",
          gap: 20,
        }}
      >
        <img
          src={composer.image}
          alt={composer.name}
          style={{
            maxWidth: "100%",
            height: window.innerWidth < 768 ? "150px" : "250px",
            borderRadius: "10px",
          }}
        />
        <div>
          {isLoading ? (
            <Skeleton.Input
              active={true}
              size="default"
              style={{
                backgroundPositionX: 0,
                justifySelf: "flex-end",
                width: "100%",
              }}
            />
          ) : (
            <div
              style={{
                justifySelf: "flex-end",
                fontSize: window.innerWidth < 768 ? 18 : 30,
              }}
            >
              {composer.name}
            </div>
          )}
          {isLoading ? (
            <Skeleton.Input
              active={true}
              size="default"
              style={{
                marginTop: 10,
                backgroundPositionX: 0,
                justifySelf: "flex-end",
                width: "100%",
              }}
            />
          ) : (
            <div
              style={{
                marginTop: 10,
                justifySelf: "flex-end",
                fontSize: window.innerWidth < 768 ? 18 : 30,
              }}
            >
              {composer.years}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default ComposerHeader;
