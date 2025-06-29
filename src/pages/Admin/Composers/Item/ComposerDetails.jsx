import { useNavigate, useParams } from "react-router-dom";
import { Button, Form, Tabs } from "antd";
import ComposerInfoTab from "./Info/ComposerInfoTab";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { getComposerById } from "../../../../firebase/composers";

const ComposerDetailsPage = () => {
  const { id } = useParams();
  const [form] = Form.useForm();
  const nav = useNavigate();
  const [composer, setComposer] = useState(null);

  useEffect(() => {
    const fetchComposer = async () => {
      const data = await getComposerById(id);
      setComposer(data);
      form.setFieldsValue(data);
    };
    fetchComposer();
  }, [id]);

  const tabItems = [
    {
      key: "info",
      label: "Информация",
      children: (
        <ComposerInfoTab
          composerId={id}
          composer={composer}
          setComposer={setComposer}
          form={form}
        />
      ),
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
          onClick={() => nav("/admin/composers")}
        />
        <div style={{ fontSize: "20px" }}>{composer?.name}</div>
      </div>
      <Tabs
        defaultActiveKey="info"
        items={tabItems}
        style={{ width: "100%" }}
      />
    </div>
  );
};

export default ComposerDetailsPage;
