import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import { Layout, Menu } from "antd";
import HomePage from "./pages/HomePage";
import ComposersPage from "./pages/ComposersPage";
import RecordingsPage from "./pages/RecordingsPage";
import NotesPage from "./pages/NotesPage";
import ComposerDetailPage from "./pages/ComposerDetailPage";
import "./App.css";
import RecordingDetailPage from "./pages/RecordingDetailPage";
import NoteDetailPage from "./pages/NoteDetailPage";

const { Content } = Layout;

const NavigationMenu = () => {
  const navigate = useNavigate();

  return (
    <Menu
      theme="dark"
      mode="horizontal"
      defaultSelectedKeys={["/"]}
      onClick={(e) => navigate(e.key)} // Правильный обработчик кликов
      style={{ display: "flex", justifyContent: "center" }}
      items={[
        { key: "/", label: "Арқа певческая школа" },
        { key: "/composers", label: "Народные композиторы" },
        { key: "/recordings", label: "Аудиозаписи" },
        { key: "/notes", label: "Ноты" },
      ]}
    />
  );
};

const App = () => {
  return (
    <Router>
      <Layout style={{ minHeight: "100vh", background: "white" }}>
        <NavigationMenu /> {/* Теперь навигация в правильном месте */}
        <Content
          style={{
            padding: "40px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            textAlign: "center",
          }}
        >
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/composers" element={<ComposersPage />} />
            <Route path="/composers/:id" element={<ComposerDetailPage />} />
            <Route path="/notes" element={<NotesPage />} />
            <Route path="/notes/:id" element={<NoteDetailPage />} />
            <Route path="/recordings" element={<RecordingsPage />} />
            <Route path="/recordings/:id" element={<RecordingDetailPage />} />
          </Routes>
        </Content>
      </Layout>
    </Router>
  );
};

export default App;
