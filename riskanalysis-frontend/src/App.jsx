import { Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";

import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import Risks from "./pages/Risks";
import Users from "./pages/Users";
import Chatbot from "./pages/Chatbot";
import ProjectForm from "./pages/forms/ProjectForm";
import RiskForm from "./pages/forms/RiskForm";
import ProjectHealth from "./pages/ProjectHealth";
import AddUser from "./pages/AddUser";
import EditUser from "./pages/EditUser";
import Teams from "./pages/Teams";
import Login from "./pages/Login";

function App() {

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token) {
    return <Login />;
  }

  return (
    <>
      <Navbar />

      <div style={{ display: "flex" }}>
        <Sidebar />

        <div
          style={{
            flex: 1,
            padding: "30px",
            background: "#F1F5F9",
            minHeight: "100vh",
          }}
        >
          <Routes>
            <Route path="/" element={<Dashboard />} />

            {(localStorage.getItem("role") === "ADMIN" ||
              localStorage.getItem("role") === "PROJECT_MANAGER") && (
              <>
                <Route path="/projects" element={<Projects />} />
                <Route path="/projects/new" element={<ProjectForm />} />
                <Route path="/projects/edit/:id" element={<ProjectForm />} />
              </>
            )}

            {localStorage.getItem("role") !== "VIEWER" && (
              <>
                <Route path="/risks" element={<Risks />} />
                <Route path="/risks/new" element={<RiskForm />} />
                <Route path="/risks/edit/:id" element={<RiskForm />} />
              </>
            )}

            {localStorage.getItem("role") === "ADMIN" && (
              <>
                <Route path="/users" element={<Users />} />
                <Route path="/users/new" element={<AddUser />} />
                <Route path="/users/edit/:id" element={<EditUser />} />
                <Route path="/teams" element={<Teams />} />
              </>
            )}

            <Route path="/project-health" element={<ProjectHealth />} />
          </Routes>
        </div>
      </div>
    </>
  );
}

export default App;