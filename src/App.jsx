import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { Button, Drawer, Layout, Menu } from "antd";
import { AnimatePresence, motion } from "framer-motion";
import HomePage from "./pages/HomePage";
import ComposersPage from "./pages/ComposersPage";
import RecordingsPage from "./pages/RecordingsPage";
import NotesPage from "./pages/NotesPage";
import ComposerDetailPage from "./pages/ComposerDetailPage";
import RecordingDetailPage from "./pages/RecordingDetailPage";
import NoteDetailPage from "./pages/NoteDetailPage";
import StagesOfMentoringStudentPage from "./pages/StagesOfMentoringStudentPage";
import StagesOfMentoringStudentDetailPage from "./pages/StagesOfMentoringStudentDetailPage";
import { MenuOutlined } from "@ant-design/icons";
import "./App.css";
import { items } from "./data/items";

const { Content, Header } = Layout;

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

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

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ duration: 0.3 }}
        style={{
          width: "100%",
          background: "white",
          padding: "40px 0",
          borderRadius: 10,
        }}
      >
        <Routes location={location}>
          <Route path="/" element={<HomePage />} />
          <Route path="/composers" element={<ComposersPage />} />
          <Route
            path="/stagesOfMentoringStudent"
            element={<StagesOfMentoringStudentPage />}
          />
          <Route
            path="/stagesOfMentoringStudent/:id"
            element={<StagesOfMentoringStudentDetailPage />}
          />
          <Route path="/composers/:id" element={<ComposerDetailPage />} />
          <Route path="/notes" element={<NotesPage />} />
          <Route path="/notes/:id" element={<NoteDetailPage />} />
          <Route path="/recordings" element={<RecordingsPage />} />
          <Route path="/recordings/:id" element={<RecordingDetailPage />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
};

const App = () => {
  return (
    <Router>
      <Layout
        style={{
          minHeight: "100vh",
          background: "transparent",
        }}
      >
        <NavigationMenu />
        <Content
          style={{
            padding: window.innerWidth < 768 ? "20px" : "40px",
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
            textAlign: "center",
          }}
        >
          <AnimatedRoutes />
        </Content>
      </Layout>
    </Router>
  );
};

export default App;
