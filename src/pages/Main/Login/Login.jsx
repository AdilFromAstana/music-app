import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Form, Input, message } from "antd";
import { auth } from "../../../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true); // Переключатель между входом и регистрацией
  const navigate = useNavigate();

  // Проверка, авторизован ли пользователь
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        navigate("/"); // Если уже вошел, перенаправляем на главную
      }
    });
  }, [navigate]);

  // Обработка отправки формы
  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      if (isLogin) {
        // Вход
        await signInWithEmailAndPassword(auth, values.email, values.password);
        message.success("Вход выполнен!");
      } else {
        // Регистрация
        await createUserWithEmailAndPassword(
          auth,
          values.email,
          values.password
        );
        message.success("Аккаунт создан!");
      }
    } catch (error) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "100px auto", padding: 20 }}>
      <h1>{isLogin ? "Вход" : "Регистрация"}</h1>
      <Form onFinish={handleSubmit}>
        <Form.Item
          name="email"
          rules={[{ required: true, message: "Введите email" }]}
        >
          <Input placeholder="Email" />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[{ required: true, message: "Введите пароль" }]}
        >
          <Input.Password placeholder="Пароль" />
        </Form.Item>

        <Button type="primary" htmlType="submit" loading={loading} block>
          {isLogin ? "Войти" : "Зарегистрироваться"}
        </Button>

        <Button type="link" onClick={() => setIsLogin(!isLogin)} block>
          {isLogin
            ? "Нет аккаунта? Зарегистрироваться"
            : "Уже есть аккаунт? Войти"}
        </Button>
      </Form>
    </div>
  );
};

export default Login;
