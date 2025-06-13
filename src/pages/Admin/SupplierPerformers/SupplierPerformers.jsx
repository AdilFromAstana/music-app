import { Table, Input, Button, Select, Tag } from "antd";
import { useState, useCallback, memo, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { getSupplierPerformers } from "../../../firebase/supplierPerformers";

const debounce = (func, delay) => {
  let timer;
  return (...args) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      func(...args);
    }, delay);
  };
};

const SupplierPerformers = memo(() => {
  const nav = useNavigate();
  const queryClient = useQueryClient();
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [sorter, setSorter] = useState({
    field: null,
    order: null,
  });
  const [searchFilters, setSearchFilters] = useState({
    title: "",
    active: null,
  });
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const { data: supplierPerformers, isLoading } = useQuery({
    queryKey: [
      "supplierPerformers",
      {
        page: pagination.current,
        pageSize: pagination.pageSize,
        sortField: sorter.field,
        sortOrder: sorter.order,
        filters: searchFilters,
      },
    ],
    queryFn: async ({ queryKey }) => {
      const [, params] = queryKey;

      const cachedData = queryClient.getQueryData([
        "supplierPerformers",
        params,
      ]);
      if (cachedData) {
        return cachedData;
      }

      return getSupplierPerformers(params);
    },
    keepPreviousData: true,
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
  });

  useEffect(() => {
    const dwa = async () => {
      getSupplierPerformers();
    };

    dwa();
  }, []);

  const handleTableChange = (pagination, _filters, sorter) => {
    setPagination({ ...pagination });
    setSorter({
      field: sorter.field || null,
      order:
        sorter.order === "ascend"
          ? "asc"
          : sorter.order === "descend"
          ? "desc"
          : null,
    });
    queryClient.invalidateQueries("cities");
  };

  const handleSearchDebounced = useCallback(
    debounce((key, value) => {
      setSearchFilters((prev) => ({
        ...prev,
        [key]: value,
      }));
    }, 500),
    [pagination.pageSize, sorter.field, sorter.order, searchFilters]
  );

  const columns = [
    {
      title: "Название",
      dataIndex: "name",
      key: "name",
      sorter: true,
      filterDropdown: () => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder="Поиск по названию"
            defaultValue={searchFilters.title}
            onChange={(e) => handleSearchDebounced("name", e.target.value)}
            style={{ width: 188, marginBottom: 8, display: "block" }}
          />
        </div>
      ),
      width: 200,
    },
  ];

  return (
    <div style={{ padding: "16px", background: "white", height: "100%" }}>
      <div style={{ display: "flex", gap: "10px" }}>
        <h2 style={{ margin: 0, textTransform: "uppercase" }}>
          ⁠Жеткізуші орындаушылар
        </h2>
        <Button type="primary" onClick={() => setIsCreateModalOpen(true)}>
          Добавить запись
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={supplierPerformers || []}
        loading={isLoading}
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: pagination.total,
          showSizeChanger: true,
        }}
        onRow={(record) => ({ onClick: () => nav(`./${record.id}`) })}
        onChange={handleTableChange}
      />

      {/* <CreateSupplierPerformerModal
        refreshData={{
          page: pagination.current,
          pageSize: pagination.pageSize,
          sortField: sorter.field,
          sortOrder: sorter.order,
          filters: searchFilters,
        }}
        open={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      /> */}
    </div>
  );
});

SupplierPerformers.displayName = "SupplierPerformers";

export default SupplierPerformers;
