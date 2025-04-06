import { Menu, Modal } from "antd";
import Sider from "antd/es/layout/Sider";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { adminItems } from "../data/items";

const AdminLayout = () => {
  const nav = useNavigate();
  const location = useLocation();
  const [selectedKey, setSelectedKey] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    const path = location.pathname.replace(/^\/admin/, "") || "/notes";
    setSelectedKey(path);
    localStorage.setItem("selectedMenuKey", path);
  }, [location]);

  const onClick = (e) => {
    if (e.key === "logout") {
      showLogoutModal();
    } else {
      setSelectedKey(e.key);
      nav(`/admin${e.key}`);
    }
  };

  const showLogoutModal = () => setIsModalVisible(true);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("selectedMenuKey");
    window.location.reload();
  };

  return (
    <div
      style={{
        display: "flex",
        width: "100%",
        justifyContent: "flex-start",
        minHeight: "100%",
      }}
    >
      <Sider>
        <Menu
          onClick={onClick}
          selectedKeys={[selectedKey]}
          mode="inline"
          items={[
            ...adminItems,
            {
              key: "logout",
              label: "Выйти",
            },
          ]}
        />
      </Sider>
      <main
        style={{
          width: "100%",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Outlet />
      </main>

      <Modal
        title="Выход"
        open={isModalVisible}
        onOk={handleLogout}
        onCancel={() => setIsModalVisible(false)}
        okText="Да, выйти"
        cancelText="Отмена"
      >
        <p>Вы уверены, что хотите выйти?</p>
      </Modal>
    </div>
  );
};

export default AdminLayout;
