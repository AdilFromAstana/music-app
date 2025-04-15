import { Table, Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";

export const ComposerNoteTable = ({
  showModal,
  columns,
  isLoading,
  audios,
  onRowClick,
}) => {
  return (
    <>
      <div style={{ marginBottom: 16 }}>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => showModal()}
        >
          Добавить ноты
        </Button>
      </div>
      <Table
        dataSource={audios}
        columns={columns}
        rowKey="id"
        loading={isLoading}
        pagination={false}
        onRow={(record) => ({
          onClick: () => onRowClick(record),
        })}
      />
    </>
  );
};
