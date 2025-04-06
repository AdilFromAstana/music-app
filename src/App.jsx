import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";
import { ConfigProvider } from "antd";
import StagesOfMentoringStudentDetailPage from "./pages/Main/StagesOfMentoringStudentDetailPage";
import StagesOfMentoringStudentPage from "./pages/Main/StagesOfMentoringStudentPage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import RecordingDetailPage from "./pages/Main/RecordingDetailPage";
import ComposerDetailPage from "./pages/Main/ComposerDetailPage";
import Recordings from "./pages/Admin/Recordings/Recordings";
import Composers from "./pages/Admin/Composers/Composers";
import RecordingsPage from "./pages/Main/RecordingsPage";
import NoteDetailPage from "./pages/Main/NoteDetailPage";
import { AnimatePresence, motion } from "framer-motion";
import ComposersPage from "./pages/Main/ComposersPage";
import AdminLayout from "./layouts/AdminLayout";
import NotesPage from "./pages/Main/NotesPage";
import MainLayout from "./layouts/MainLayout";
import HomePage from "./pages/Main/HomePage";
import Notes from "./pages/Admin/Notes/Notes";
import "./App.css";

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

const adminRoutes = [
  { path: "composers", element: <Composers /> },
  { path: "notes", element: <Notes /> },
  { path: "recordings", element: <Recordings /> },
];

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
          minHeight: "100vh",
          width: "100%",
          background: "transparent",
          borderRadius: 10,
        }}
      >
        <Routes location={location}>
          <Route path="/admin/*" element={<AdminLayout />}>
            {adminRoutes.map(({ path, element }) => (
              <Route key={path} path={path} element={element} />
            ))}
            <Route index element={<Navigate to="composers" replace />} />
          </Route>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<HomePage />} />
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
          </Route>
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
};

const AppRouter = () => {
  return (
    <Router>
      <AnimatedRoutes />
    </Router>
  );
};

function App() {
  const queryClient = new QueryClient();
  return (
    <ConfigProvider theme={{ hashed: false }}>
      <QueryClientProvider client={queryClient}>
        <AppRouter />
      </QueryClientProvider>
    </ConfigProvider>
  );
}

export default App;
