import { Outlet, useNavigate } from "react-router-dom";
import { MenuOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { items } from "../data/items";
import { Button, Drawer, Layout, Menu } from "antd";
import { ComposersProvider } from "../context/ComposersContext";
import Sider from "antd/es/layout/Sider";
import "./MainLayout.scss";

const { Header, Content } = Layout;

const NavigationMenu = () => {
  const navigate = useNavigate();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedKey, setSelectedKey] = useState("/");

  useEffect(() => {
    setSelectedKey(localStorage.getItem("selectedKey") ?? "/");
  }, []);

  return window.innerWidth < 768 ? (
    <Header
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        background: "white",
      }}
    >
      <div style={{ color: "black", fontSize: 20 }}>Арқа әншілік мектебі</div>
      <Button
        onClick={() => setIsDrawerOpen(true)}
        icon={<MenuOutlined style={{ fontSize: 20 }} />}
      />
      <Drawer
        title="Меню"
        placement="right"
        onClose={() => setIsDrawerOpen(false)}
        open={isDrawerOpen}
        styles={{
          body: { padding: 0 },
        }}
      >
        <motion.div
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 100, opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Menu
            selectedKeys={[selectedKey]}
            mode="vertical"
            onClick={(e) => {
              setIsDrawerOpen(false);
              navigate(e.key);
              localStorage.setItem("selectedKey", e.key);
              setSelectedKey(e.key);
            }}
            items={items}
          />
        </motion.div>
      </Drawer>
    </Header>
  ) : (
    <Menu
      selectedKeys={[selectedKey]}
      mode="horizontal"
      onClick={(e) => {
        navigate(e.key);
        setSelectedKey(e.key);
        localStorage.setItem("selectedKey", e.key);
      }}
      style={{ display: "flex", justifyContent: "center" }}
      items={items}
    />
  );
};

const MainLayout = () => {
  return (
    <ComposersProvider>
      <Layout style={{ minHeight: "100vh" }} className="mainLayoutWrapper">
        <Sider className="mainSider" width={200}>
          <Menu
            mode="inline"
            defaultSelectedKeys={["profile"]}
            style={{ height: "100%", borderRight: 0 }}
            items={items}
          />
        </Sider>

        {/* Главная часть с хедером и контентом */}
        <Layout
          style={{
            marginLeft: 200,
          }}
        >
          <div
            style={{
              height: 64,
              background: "#fff",
              display: "flex",
              alignItems: "center",
              padding: "0 24px",
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              zIndex: 2,
              borderBottom: "1px solid #f0f0f0",
            }}
          >
            <div style={{ fontWeight: "bold", fontSize: "18px" }}>
              VK Layout
            </div>
          </div>

          <Content
            style={{
              marginTop: 64,
              padding: "24px",
              background: "#fff",
              minHeight: "100vh",
            }}
          >
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </ComposersProvider>
  );
};

export default MainLayout;
