import { Avatar, Dropdown, Layout, Menu, Modal, Select, Space } from "antd";
import Sider from "antd/es/layout/Sider";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { adminItems } from "../data/items";
import "./MainLayout.scss";
import { onAuthStateChanged } from "firebase/auth";
import { UserOutlined, LogoutOutlined } from "@ant-design/icons";
import { auth } from "../firebase/firebase";

const { Content } = Layout;

const AdminLayout = () => {
  const nav = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [selectedKey, setSelectedKey] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const showLogoutModal = () => setIsModalVisible(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const path = location.pathname.replace(/^\/admin/, "") || "/notes";
    setSelectedKey(path);
    localStorage.setItem("selectedMenuKey", path);
  }, [location]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const onClick = (e) => {
    if (e.key === "logout") {
      showLogoutModal();
    } else {
      setSelectedKey(e.key);
      nav(`/admin${e.key}`);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("selectedMenuKey");
    window.location.reload();
  };

  const userMenu = (
    <Menu>
      <Menu.Item
        key="profile"
        icon={<UserOutlined />}
        onClick={() => nav("/admin")}
      >
        Профиль
      </Menu.Item>
      <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={handleLogout}>
        Выйти
      </Menu.Item>
    </Menu>
  );

  return (
    <Layout style={{ minHeight: "100vh" }} className="mainLayoutWrapper">
      <Sider className="mainSider" width={200}>
        <Menu
          mode="inline"
          selectedKeys={[selectedKey]}
          style={{ height: "100%", borderRight: 0 }}
          onClick={onClick}
          items={adminItems}
        />
      </Sider>
      <Layout style={{ marginLeft: 200 }}>
        <div
          style={{
            height: 64,
            background: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 24px",
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 2,
            borderBottom: "1px solid #f0f0f0",
            boxShadow: "0 2px 4px rgba(0,0,0,0.03)",
          }}
        >
          <div style={{ fontWeight: "bold", fontSize: 18 }}>VK Layout</div>

          <Space size="middle" align="center">
            {user && (
              <Dropdown overlay={userMenu} placement="bottomRight">
                <span style={{ cursor: "pointer" }}>
                  <Avatar
                    src={user.photoURL}
                    icon={<UserOutlined />}
                    style={{ backgroundColor: "#1890ff" }}
                  />
                  <span style={{ marginLeft: 8 }}>
                    {user.displayName || user.email}
                  </span>
                </span>
              </Dropdown>
            )}
          </Space>
        </div>
        <Content
          style={{
            marginTop: 64,
            background: "#fff",
            minHeight: "calc(100vh - 64px)",
          }}
        >
          <Outlet />
        </Content>
      </Layout>
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
    </Layout>
  );
};

export default AdminLayout;
