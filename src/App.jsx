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
import Videos from "./pages/Main/Videos/Videos";
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
import ComposerItem from "./pages/Admin/Composers/Item/ComposerDetails";
import ComposerDetailPage from "./pages/Main/Composer/ComposerDetailPage";
import Composers from "./pages/Admin/Composers/Composers";
import Introduction from "./pages/Main/Introduction/Introduction";
import ComposersNotePage from "./pages/Main/Note/ComposersNotePage";
import VideosDetail from "./pages/Main/Videos/VideosDetail";
import SupplierPerformersPage from "./pages/Main/SupplierPerformers/SupplierPerformersPage";
import FormationOfTraditionalSongArt from "./pages/Main/FormationOfTraditionalSongArt/FormationOfTraditionalSongArt";
import SupplierPerformerDetailPage from "./pages/Main/SupplierPerformers/SupplierPerformerDetailPage";
import Conclusion from "./pages/Main/Conclusion/Conclusion";
import "./App.css";
import Login from "./pages/Main/Login/Login";
import { LanguageProvider } from "./context/LanguageContext";

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
    path: "/composers/:id",
    element: <ComposerDetailPage />,
  },
  {
    path: "/stagesOfMentoringStudent",
    element: <StagesOfMentoringStudentPage />,
  },
  {
    path: "/stagesOfMentoringStudent/:id",
    element: <StagesOfMentoringStudentDetailPage />,
  },
  {
    path: "/composersNotes",
    element: <ComposersNotePage />,
  },
  {
    path: "/composersNotes/:composerId/",
    element: <NotesPage />,
  },
  {
    path: "/composersNotes/:composerId/:compositionId",
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
    path: "/videos",
    element: <Videos />,
  },
  {
    path: "/videos/:id",
    element: <VideosDetail />,
  },
  {
    path: "/supplierPerformers",
    element: <SupplierPerformersPage />,
  },
  {
    path: "/supplierPerformers/:id",
    element: <SupplierPerformerDetailPage />,
  },
  {
    path: "/formationOfTraditionalSongArt",
    element: <FormationOfTraditionalSongArt />,
  },
  {
    path: "/conclusion",
    element: <Conclusion />,
  },
  {
    path: "/login",
    element: <Login />,
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
        <LanguageProvider>
          <AppRouter />
        </LanguageProvider>
      </QueryClientProvider>
    </ConfigProvider>
  );
}

export default App;
