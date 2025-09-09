import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Layout from "./components/layout/Layout";
import MyTraining from "./pages/MyTraining";
import SeriesEditor from "./pages/SeriesEditor";
import WorkoutPlayer from "./pages/WorkoutPlayer";
import Profile from "./pages/Profile";
import Exercises from "./pages/Exercises";
import Students from "./pages/Students";
import Planejamento from "./pages/Planejamento";
import StudentHub from "./pages/StudentHub";
import ProtectedRoute from "./router/ProtectedRoute";

function AppRoutes() {
  const DashboardContent = () => (
    <div>
      <h2>Dashboard</h2>
      <p>Bem-vindo ao Gym Assist!</p>
    </div>
  );

  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route element={<ProtectedRoute />}>
        <Route
          path="/"
          element={
            <Layout>
              <DashboardContent />
            </Layout>
          }
        />
        <Route
          path="/meu-treino"
          element={
            <Layout>
              <MyTraining />
            </Layout>
          }
        />
        <Route
          path="/perfil"
          element={
            <Layout>
              <Profile />
            </Layout>
          }
        />
        <Route
          path="/planejamento"
          element={
            <Layout>
              <Planejamento />
            </Layout>
          }
        />
        <Route
          path="/exercicios"
          element={
            <Layout>
              <Exercises />
            </Layout>
          }
        />
        <Route
          path="/meus-alunos"
          element={
            <Layout>
              <Students />
            </Layout>
          }
        />
        <Route
          path="/aluno/:studentId"
          element={
            <Layout>
              <StudentHub />
            </Layout>
          }
        />
        <Route
          path="/series/nova"
          element={
            <Layout>
              <SeriesEditor />
            </Layout>
          }
        />
        <Route
          path="/series/editor/:seriesId"
          element={
            <Layout>
              <SeriesEditor />
            </Layout>
          }
        />
        <Route
          path="/treino/player/:seriesId"
          element={
            <Layout>
              <WorkoutPlayer />
            </Layout>
          }
        />
      </Route>
    </Routes>
  );
}

export default AppRoutes;
