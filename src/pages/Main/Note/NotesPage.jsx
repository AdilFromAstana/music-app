import React from "react";
import { List, Typography } from "antd";
import { Link, useParams } from "react-router-dom";
import { getCompositions } from "../../../firebase";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const { Title } = Typography;

const NotesPage = () => {
  const queryClient = useQueryClient();
  const { composerId } = useParams();

  const {
    data: compositions = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["compositions", {}],
    queryFn: async ({ queryKey }) => {
      const [, params] = queryKey;
      const cached = queryClient.getQueryData(["compositions", params]);
      if (cached) return cached;
      return getCompositions(params);
    },
    keepPreviousData: true,
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
  });

  console.log("compositions: ", compositions);

  return (
    <div
      style={{
        maxWidth: "800px",
        textAlign: "center",
        margin: "0 auto",
        width: "100%",
      }}
    >
      <Title level={2}>НОТАЛАР</Title>
      <List
        loading={isLoading}
        bordered
        dataSource={compositions}
        renderItem={(composition) => (
          <List.Item>
            <Link to={`/composersNotes/${composerId}/${composition.id}`}>
              {composition.title}
            </Link>
          </List.Item>
        )}
      />
    </div>
  );
};

export default NotesPage;
