import { createContext, useContext } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getComposers } from "../firebase/composers";
import { getSupplierPerformers } from "../firebase/supplierPerformers";

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const queryClient = useQueryClient();

  const {
    data: composers = [],
    isLoading: isComposersLoading,
    error: composersError,
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

  const {
    data: supplierPerformers = [],
    isLoading: isSupplierPerformersLoading,
    error: supplierPerformersError,
  } = useQuery({
    queryKey: ["supplierPerformers", {}],
    queryFn: async ({ queryKey }) => {
      const [, params] = queryKey;
      const cached = queryClient.getQueryData(["supplierPerformers", params]);
      if (cached) return cached;
      return getSupplierPerformers(params);
    },
    keepPreviousData: true,
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
  });

  return (
    <DataContext.Provider
      value={{
        composers,
        isComposersLoading,
        composersError,
        supplierPerformers,
        isSupplierPerformersLoading,
        supplierPerformersError,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

// Вспомогательный хук для использования контекста
export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useData must be used within a ComposersProvider");
  }
  return context;
};
