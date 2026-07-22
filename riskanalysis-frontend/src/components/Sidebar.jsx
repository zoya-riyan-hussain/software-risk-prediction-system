import { NavLink } from "react-router-dom";

import DashboardIcon from "@mui/icons-material/Dashboard";
import FolderIcon from "@mui/icons-material/Folder";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import PeopleIcon from "@mui/icons-material/People";
import MonitorHeartIcon from "@mui/icons-material/MonitorHeart";
import GroupsIcon from "@mui/icons-material/Groups";

function Sidebar() {
  const role = localStorage.getItem("role");
  const name = localStorage.getItem("name") || "User";

  const menus = [
    { name: "Dashboard", icon: <DashboardIcon />, path: "/" },

    ...(role === "ADMIN" || role === "PROJECT_MANAGER"
      ? [{ name: "Projects", icon: <FolderIcon />, path: "/projects" }]
      : []),

    ...(role === "ADMIN"
      ? [{ name: "Teams", icon: <GroupsIcon />, path: "/teams" }]
      : []),

    ...(role === "ADMIN" || role === "PROJECT_MANAGER"
      ? [{ name: "Risks", icon: <WarningAmberIcon />, path: "/risks" }]
      : []),

    ...(role === "ADMIN"
      ? [{ name: "Users", icon: <PeopleIcon />, path: "/users" }]
      : []),

    {
      name: "Project Health",
      icon: <MonitorHeartIcon />,
      path: "/project-health",
    },
  ];

  return (
    <div
      style={{
        width: "250px",
        minHeight: "100vh",
        background: "#0F172A",
        color: "white",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        borderRight: "1px solid #1E293B",
      }}
    >
      <div>
        <div
          style={{
            padding: "24px",
            borderBottom: "1px solid #1E293B",
          }}
        >
          <div
            style={{
              fontSize: "26px",
              fontWeight: "700",
            }}
          >
            🛡 RiskAI
          </div>

          <div
            style={{
              fontSize: "13px",
              color: "#94A3B8",
              marginTop: "6px",
            }}
          >
            Software Risk Prediction
          </div>
        </div>

        <div style={{ padding: "18px 12px" }}>
          {menus.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              style={({ isActive }) => ({
                display: "flex",
                alignItems: "center",
                gap: "14px",
                padding: "13px 16px",
                marginBottom: "8px",
                borderRadius: "10px",
                textDecoration: "none",
                color: isActive ? "#FFFFFF" : "#CBD5E1",
                background: isActive ? "#3B82F6" : "transparent",
                fontWeight: isActive ? "600" : "500",
                transition: "all 0.25s ease",
              })}
            >
              <span style={{ fontSize: "22px" }}>{item.icon}</span>
              <span>{item.name}</span>
            </NavLink>
          ))}
        </div>
      </div>

      <div
        style={{
          padding: "20px",
          borderTop: "1px solid #1E293B",
          display: "flex",
          alignItems: "center",
          gap: "12px",
        }}
      >
        <div
          style={{
            width: "42px",
            height: "42px",
            borderRadius: "50%",
            background: "#3B82F6",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontWeight: "bold",
            fontSize: "18px",
          }}
        >
          {name.charAt(0).toUpperCase()}
        </div>

        <div>
          <div
            style={{
              fontWeight: "600",
              fontSize: "15px",
            }}
          >
            {name}
          </div>

          <div
            style={{
              color: "#94A3B8",
              fontSize: "12px",
            }}
          >
            {role}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;