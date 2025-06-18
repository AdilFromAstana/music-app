import { Outlet, useNavigate } from "react-router-dom";
import {
  GlobalOutlined,
  LoginOutlined,
  LogoutOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import { items } from "../data/items";
import {
  Button,
  Layout,
  Menu,
  Select,
  Space,
  Avatar,
  Dropdown,
  message,
  Modal,
  Form,
  Input,
  Spin,
} from "antd";
import { DataProvider } from "../context/DataContext";
import Sider from "antd/es/layout/Sider";
import "./MainLayout.scss";
import { auth } from "../firebase/firebase";
import {
  onAuthStateChanged,
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { LanguageProvider, useLanguage } from "../context/LanguageContext";

const { Option } = Select;
const { Content } = Layout;

const MainLayout = () => {
  const { language, setLanguage } = useLanguage();
  const [selectedKey, setSelectedKey] = useState("/");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [form] = Form.useForm();
  const nav = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    setSelectedKey(localStorage.getItem("selectedKey") ?? "/");
  }, []);

  const handleLogin = () => {
    setIsModalOpen(true);
    setIsLogin(true);
    form.resetFields();
  };

  const handleAuthSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      if (isLogin) {
        // Вход
        await signInWithEmailAndPassword(auth, values.email, values.password);
        message.success("Вход выполнен успешно");
      } else {
        // Регистрация
        await createUserWithEmailAndPassword(
          auth,
          values.email,
          values.password
        );
        message.success("Аккаунт создан успешно");
      }
      setIsModalOpen(false);
    } catch (error) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      message.success("Вы успешно вышли из системы");
    } catch (error) {
      message.error("Ошибка при выходе из системы");
      console.error("Logout error:", error);
    }
  };

  const userMenu = (
    <Menu>
      <Menu.Item
        key="profile"
        icon={<UserOutlined />}
        onClick={() => nav("/admin")}
      >
        Админ панель
      </Menu.Item>
      <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={handleLogout}>
        Выйти
      </Menu.Item>
    </Menu>
  );

  return (
    <DataProvider>
      <Layout style={{ minHeight: "100vh" }} className="mainLayoutWrapper">
        <Sider className="mainSider" width={200}>
          <Menu
            mode="inline"
            selectedKeys={[selectedKey]}
            style={{ height: "100%", borderRight: 0 }}
            items={items}
            onClick={(e) => {
              setSelectedKey(e.key);
              localStorage.setItem("selectedKey", e.key);
              nav(e.key);
            }}
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
            <div style={{ fontWeight: "bold", fontSize: 18 }}>Дәстүрлі ән</div>

            <Space size="middle" align="center">
              <Select
                defaultValue="ru"
                value={language}
                style={{
                  width: 110,
                  borderRadius: 8,
                }}
                suffixIcon={<GlobalOutlined />}
                onSelect={(value) => setLanguage(value)}
              >
                <Option value="ru">Русский</Option>
                <Option value="en">English</Option>
                <Option value="kz">Қазақша</Option>
                <Option value="tk">Турецкий</Option>
              </Select>

              {user ? (
                <Dropdown overlay={userMenu} placement="bottomRight">
                  <Space style={{ cursor: "pointer" }}>
                    <Avatar
                      src={user.photoURL}
                      icon={<UserOutlined />}
                      style={{ backgroundColor: "#1890ff" }}
                    />
                    <span>{user.displayName || user.email}</span>
                  </Space>
                </Dropdown>
              ) : (
                <Button
                  type="primary"
                  icon={<LoginOutlined />}
                  style={{ borderRadius: 8 }}
                  onClick={handleLogin}
                >
                  Войти
                </Button>
              )}
            </Space>
          </div>
          <Content
            style={{
              marginTop: 64,
              padding: "24px",
              background: "#fff",
              minHeight: "calc(100vh - 64px)",
            }}
          >
            <Outlet context={{ user }} />
          </Content>
        </Layout>

        <Modal
          title={isLogin ? "Вход в систему" : "Регистрация"}
          open={isModalOpen}
          onOk={handleAuthSubmit}
          onCancel={() => setIsModalOpen(false)}
          confirmLoading={loading}
          okText={isLogin ? "Войти" : "Зарегистрироваться"}
          cancelText="Отмена"
        >
          <Spin spinning={loading}>
            <Form form={form} layout="vertical">
              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { required: true, message: "Пожалуйста, введите email" },
                  { type: "email", message: "Неверный формат email" },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="password"
                label="Пароль"
                rules={[
                  { required: true, message: "Пожалуйста, введите пароль" },
                  {
                    min: 6,
                    message: "Пароль должен быть не менее 6 символов",
                  },
                ]}
              >
                <Input.Password />
              </Form.Item>

              {!isLogin && (
                <Form.Item
                  name="confirm"
                  label="Подтвердите пароль"
                  dependencies={["password"]}
                  rules={[
                    {
                      required: true,
                      message: "Пожалуйста, подтвердите пароль",
                    },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue("password") === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(new Error("Пароли не совпадают"));
                      },
                    }),
                  ]}
                >
                  <Input.Password />
                </Form.Item>
              )}

              <Button
                type="link"
                onClick={() => setIsLogin(!isLogin)}
                style={{ padding: 0 }}
              >
                {isLogin
                  ? "Нет аккаунта? Зарегистрироваться"
                  : "Уже есть аккаунт? Войти"}
              </Button>
            </Form>
          </Spin>
        </Modal>
      </Layout>
    </DataProvider>
  );
};

export default MainLayout;
