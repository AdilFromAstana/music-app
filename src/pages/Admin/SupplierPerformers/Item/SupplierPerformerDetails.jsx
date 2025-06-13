import { useNavigate, useParams } from "react-router-dom";
import { Button, Form, Tabs } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { getSupplierPerformerById } from "../../../../firebase/supplierPerformers";
import SupplierPerformerInfoTab from "./Info/SupplierPerformerInfoTab";
import SupplierPerformerSongsTab from "./Songs/SupplierPerformerSongsTab";

const SupplierPerformerDetailsPage = () => {
  const { id } = useParams();
  const [form] = Form.useForm();
  const nav = useNavigate();
  const [supplierPerformer, setSupplierPerformer] = useState(null);

  useEffect(() => {
    const fetchSupplierPerformer = async () => {
      const data = await getSupplierPerformerById(id);
      setSupplierPerformer(data);
      form.setFieldsValue(data);
    };
    fetchSupplierPerformer();
  }, [id]);

  const tabItems = [
    {
      key: "info",
      label: "Информация",
      children: (
        <SupplierPerformerInfoTab
          supplierPerformerId={id}
          supplierPerformer={supplierPerformer}
          setSupplierPerformer={setSupplierPerformer}
          form={form}
        />
      ),
    },
    {
      key: "songs",
      label: "Песни",
      children: <SupplierPerformerSongsTab supplierPerformerId={id} />,
    },
  ];

  return (
    <div
      style={{
        padding: 24,
        backgroundColor: "white",
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "start",
      }}
    >
      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => nav("/admin/supplierPerformers")}
        />
        <div style={{ fontSize: "20px" }}>{supplierPerformer?.name}</div>
      </div>
      <Tabs
        defaultActiveKey="info"
        items={tabItems}
        style={{ width: "100%" }}
      />
    </div>
  );
};

export default SupplierPerformerDetailsPage;
