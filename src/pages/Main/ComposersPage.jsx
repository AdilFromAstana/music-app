import React from "react";
import { List, Typography } from "antd";
import { Link } from "react-router-dom";
import { getComposers } from "../../firebase";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const { Title } = Typography;

const ComposersPage = () => {
  const queryClient = useQueryClient();

  const { data: composers = [], isLoading } = useQuery({
    queryKey: ["composers", {}],
    queryFn: async ({ queryKey }) => {
      const [, params] = queryKey;

      const cachedData = queryClient.getQueryData(["composers", params]);
      if (cachedData) {
        return cachedData;
      }

      return getComposers(params);
    },
    keepPreviousData: true,
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
  });

  return (
    <div style={{ maxWidth: "800px", textAlign: "center", margin: "0 auto" }}>
      <Title level={2}>ХАЛЫҚ КОМПОЗИТОРЛАРЫ</Title>
      <List
        loading={isLoading}
        bordered
        dataSource={composers}
        renderItem={(composer) => (
          <List.Item>
            <Link to={`/composers/${composer.id}`}>{composer.name}</Link>
          </List.Item>
        )}
      />
    </div>
  );
};

export default ComposersPage;
