import { Outlet, useNavigate } from "react-router-dom";
import { useState } from "react";
import { items } from "../data/items";
import { Button, Drawer, Layout, Menu } from "antd";

const { Header, Content } = Layout;

const NavigationMenu = () => {
  const navigate = useNavigate();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

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
            mode="vertical"
            defaultSelectedKeys={["/"]}
            onClick={(e) => {
              setIsDrawerOpen(false);
              navigate(e.key);
            }}
            items={items}
          />
        </motion.div>
      </Drawer>
    </Header>
  ) : (
    <Menu
      mode="horizontal"
      defaultSelectedKeys={["/"]}
      onClick={(e) => navigate(e.key)}
      style={{ display: "flex", justifyContent: "center" }}
      items={items}
    />
  );
};

const MainLayout = () => {
  return (
    <>
      <NavigationMenu />
      <Layout
        style={{
          background: "transparent",
        }}
      >
        <Content
          style={{
            padding: window.innerWidth < 768 ? "20px" : "40px",
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
            textAlign: "center",
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </>
  );
};

export default MainLayout;
