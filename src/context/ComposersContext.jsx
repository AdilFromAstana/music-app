import React, { createContext, useContext } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getComposers } from "../firebase";

const ComposersContext = createContext();

export const ComposersProvider = ({ children }) => {
  const queryClient = useQueryClient();

  const {
    data: composers = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["composers", {}],
    queryFn: async ({ queryKey }) => {
      const [, params] = queryKey;
      const cached = queryClient.getQueryData(["composers", params]);
      if (cached) return cached;
      return getComposers(params);
    },
    keepPreviousData: true,
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
  });

  return (
    <ComposersContext.Provider value={{ composers, isLoading, error }}>
      {children}
    </ComposersContext.Provider>
  );
};

// Вспомогательный хук для использования контекста
export const useComposers = () => {
  const context = useContext(ComposersContext);
  if (!context) {
    throw new Error("useComposers must be used within a ComposersProvider");
  }
  return context;
};
