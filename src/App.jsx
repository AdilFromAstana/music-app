import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";
import { Layout } from "antd";
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
import "./App.css";
import Composers from "./pages/Admin/Composers/Composers";
import AdminLayout from "./layouts/AdminLayout";
import MainLayout from "./layouts/MainLayout";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

const adminRoutes = [
  { path: "composers", element: <Composers /> },
  { path: "notes", element: <Composers /> },
  { path: "recordings", element: <Composers /> },
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
            <Route index element={<Navigate to="forms" replace />} />
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
    <QueryClientProvider client={queryClient}>
      <AppRouter />
    </QueryClientProvider>
  );
}

export default App;
