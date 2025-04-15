import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";
import { ConfigProvider } from "antd";
import StagesOfMentoringStudentDetailPage from "./pages/Main/StagesOfMentoring/StagesOfMentoringStudentDetailPage";
import StagesOfMentoringStudentPage from "./pages/Main/StagesOfMentoring/StagesOfMentoringStudentPage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import RecordingDetailPage from "./pages/Main/Recording/RecordingDetailPage";
import RecordingsPage from "./pages/Main/Recording/RecordingsPage";
import NoteDetailPage from "./pages/Main/Note/NoteDetailPage";
import { AnimatePresence, motion } from "framer-motion";
import ComposersPage from "./pages/Main/Composer/ComposersPage";
import AdminLayout from "./layouts/AdminLayout";
import NotesPage from "./pages/Main/Note/NotesPage";
import MainLayout from "./layouts/MainLayout";
import HomePage from "./pages/Main/HomePage";
import "./App.css";
import ComposerItem from "./pages/Composers/Item/ComposerDetails";
import ComposerDetailPage from "./pages/Main/Composer/ComposerDetailPage";
import Composers from "./pages/Composers/Composers";
import Introduction from "./pages/Main/Introduction/Introduction";
import Conclusion from "./pages/Main/Conclusion/Conclusion";

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

const adminRoutes = [
  { path: "composers", element: <Composers /> },
  { path: "composers/:id", element: <ComposerItem /> },
];

const commonRoutes = [
  { path: "/composers", element: <ComposersPage /> },
  {
    path: "/stagesOfMentoringStudent",
    element: <StagesOfMentoringStudentPage />,
  },
  {
    path: "/stagesOfMentoringStudent/:id",
    element: <StagesOfMentoringStudentDetailPage />,
  },
  {
    path: "/composers/:id",
    element: <ComposerDetailPage />,
  },
  {
    path: "/notes",
    element: <NotesPage />,
  },
  {
    path: "/notes/:id",
    element: <NoteDetailPage />,
  },
  {
    path: "/recordings",
    element: <RecordingsPage />,
  },
  {
    path: "/recordings/:id",
    element: <RecordingDetailPage />,
  },
  {
    path: "/introduction",
    element: <Introduction />,
  },
  {
    path: "/conclusion",
    element: <Conclusion />,
  },
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
            {commonRoutes.map(({ path, element }) => (
              <Route key={path} path={path} element={element} />
            ))}
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
