import { useEffect, useState } from "react";
import FolderIcon from "@mui/icons-material/Folder";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import PeopleIcon from "@mui/icons-material/People";
import {
  Paper,
  Typography,
  Box,
  CircularProgress,
  Button,
  Chip,
} from "@mui/material";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

import DashboardCard from "../components/DashboardCard";
import "../styles/dashboard.css";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [risks, setRisks] = useState([]);
  const [projects, setProjects] = useState([]);
  const navigate = useNavigate();

useEffect(() => {
  API.get("/dashboard/summary")
    .then((res) => setSummary(res.data))
    .catch((err) => console.log(err));

 API.get("/risks")
   .then((res) => {
     console.log("Risks =", res.data);
     setRisks(Array.isArray(res.data) ? res.data : []);
   })
   .catch((err) => {
     console.log(err);
     setRisks([]);
   });
 API.get("/projects")
   .then((res) => {
     setProjects(Array.isArray(res.data) ? res.data : []);
   })
   .catch(() => {
     setProjects([]);
   });

}, []);



  if (!summary) {
    return (
     <Box
       sx={{
         display: "flex",
         justifyContent: "center",
         alignItems: "center",
         height: "70vh",
       }}
     >
        <CircularProgress />
      </Box>

    );
  }

const trendData = risks
  .filter((risk) => risk.identifiedDate)
  .sort(
    (a, b) =>
      new Date(a.identifiedDate) - new Date(b.identifiedDate)
  )
  .map((risk) => ({
    month: new Date(risk.identifiedDate).toLocaleDateString(),
    risks: risk.score,
  }));

  const pieData = [
    {
      name: "Critical",
      value: risks.filter((r) => r.level === "CRITICAL").length,
    },
    {
      name: "High",
      value: risks.filter((r) => r.level === "HIGH").length,
    },
    {
      name: "Medium",
      value: risks.filter((r) => r.level === "MEDIUM").length,
    },
    {
      name: "Low",
      value: risks.filter((r) => r.level === "LOW").length,
    },
  ].filter((item) => item.value > 0);

  const COLORS = [
    "#d32f2f",
    "#f57c00",
    "#1976d2",
    "#388e3c",
  ];

  const projectHealthCards = projects.map((project) => {
    const projectRisks = risks.filter(
      (r) => r.project && r.project.id === project.id
    );

    const critical = projectRisks.filter(
      (r) => r.level === "CRITICAL"
    ).length;

    const high = projectRisks.filter(
      (r) => r.level === "HIGH"
    ).length;

    const open = projectRisks.filter(
      (r) => r.status === "OPEN"
    ).length;

    const score = Math.max(
      0,
      100 - critical * 30 - high * 15 - open * 5
    );

    return {
      ...project,
      score,
      status:
        score >= 80
          ? "Healthy"
          : score >= 60
          ? "Warning"
          : "Critical",
    };
  });

  const healthyProjects = projectHealthCards.filter(
    (p) => p.status === "Healthy"
  ).length;

  const warningProjects = projectHealthCards.filter(
    (p) => p.status === "Warning"
  ).length;

  const criticalProjects = projectHealthCards.filter(
    (p) => p.status === "Critical"
  ).length;

  const topCriticalRisks = [...risks]
    .filter(
      (r) =>
        r.level === "CRITICAL" ||
        r.level === "HIGH"
    )
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);

  const averageHealth =
    summary.totalProjects === 0
      ? 100
      : Math.max(
          0,
          Math.round(
            100 -
              (summary.totalRisks /
                summary.totalProjects) *
                10
          )
        );

  const recentActivity = [
    {
      id: 1,
      message: `${summary.criticalRisks} Critical risks detected`,
      time: "5 min ago",
    },
    {
      id: 2,
      message: `${summary.openRisks} Open risks awaiting mitigation`,
      time: "20 min ago",
    },
    {
      id: 3,
      message: `${summary.totalProjects} Projects currently monitored`,
      time: "1 hour ago",
    },
  ];

  return (
    <div className="dashboard-container">
      <Typography variant="h4" fontWeight="bold">
        Dashboard
      </Typography>

     <Box
       sx={{
         display: "grid",
         gridTemplateColumns: {
           xs: "1fr",
           sm: "repeat(2,1fr)",
           lg: "repeat(4,1fr)",
         },
         gap: 3,
         mt: 3,
       }}
     >
       <DashboardCard
         title="Total Projects"
         value={summary.totalProjects}
         color="#3B82F6"
         icon={<FolderIcon sx={{ color: "#3B82F6", fontSize: 32 }} />}
         onClick={() => navigate("/projects")}
       />

       <DashboardCard
         title="Total Risks"
         value={summary.totalRisks}
         color="#F59E0B"
         icon={<WarningAmberIcon sx={{ color: "#F59E0B", fontSize: 32 }} />}
         onClick={() => navigate("/risks")}
       />

       <DashboardCard
         title="Users"
         value={summary.totalUsers}
         color="#8B5CF6"
         icon={<PeopleIcon sx={{ color: "#8B5CF6" }} />}
         onClick={() => navigate("/users")}
       />

       <DashboardCard
         title="Healthy Projects"
         value={healthyProjects}
         color="#10B981"
         icon={<TaskAltIcon sx={{ color: "#10B981", fontSize: 32 }} />}
         onClick={() => navigate("/project-health")}
       />
     </Box>

     <Box
       sx={{
         display: "flex",
         gap: 2,
         mt: 3,
         mb: 3,
         flexWrap: "wrap",
       }}
     >
       <Button
         variant="contained"
         onClick={() => navigate("/projects")}
       >
         + New Project
       </Button>

       <Button
         variant="contained"
         color="warning"
         onClick={() => navigate("/risks")}
       >
         + New Risk
       </Button>
     </Box>

     <Box
       sx={{
         display: "grid",
         gridTemplateColumns: {
           xs: "1fr",
           lg: "1fr 1fr",
         },
         gap: 3,
         mb: 3,
       }}
     >
       <Paper
         sx={{
           p: 3,
           borderRadius: 3,
         }}
       >
         <Typography
           variant="h6"
           fontWeight="bold"
           mb={3}
         >
           Portfolio Health Summary
         </Typography>

         <Typography variant="h2" color="success.main">
           {averageHealth}%
         </Typography>

         <Typography color="text.secondary" mb={3}>
           Overall Portfolio Health
         </Typography>

         <Box
           sx={{
             display: "flex",
             gap: 2,
             flexWrap: "wrap",
           }}
         >
           <Chip
             color="success"
             label={`${healthyProjects} Healthy`}
           />

           <Chip
             color="warning"
             label={`${warningProjects} Warning`}
           />

           <Chip
             color="error"
             label={`${criticalProjects} Critical`}
           />
         </Box>
       </Paper>

       <Paper
         sx={{
           p: 3,
           borderRadius: 3,
         }}
       >
         <Typography
           variant="h6"
           fontWeight="bold"
           mb={3}
         >
           System Status
         </Typography>

         <Typography>
           🟢 Backend API : Online
         </Typography>

         <Typography sx={{ mt: 2 }}>
           🟢 Database : Connected
         </Typography>

         <Typography sx={{ mt: 2 }}>
           🟢 AI Prediction Engine : Active
         </Typography>

         <Typography sx={{ mt: 2 }}>
           🟢 Authentication : Secure
         </Typography>
       </Paper>
     </Box>


      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            md: "2fr 1fr",
          },
          gap: 3,
          mt: 3,
          mb: 3,
        }}
      >
        <Paper sx={{ p: 3, height: 420 }}>
          <Typography variant="h6" fontWeight="bold" mb={2}>
            Risk Trend
          </Typography>

          <ResponsiveContainer width="100%" height="90%">
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="risks"
                stroke="#3B82F6"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </Paper>

        <Paper sx={{ p: 3, height: 420 }}>
          <Typography variant="h6" fontWeight="bold" mb={2}>
            Risk Distribution
          </Typography>

          <ResponsiveContainer width="100%" height="90%">
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                outerRadius={110}
                label
              >
                {pieData.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={COLORS[index]}
                  />
                ))}
              </Pie>

              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Paper>
      </Box>

      <Paper
        sx={{
          mt: 4,
          p: 4,
          borderRadius: 3,
          border: "1px solid #E2E8F0",
          boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
        }}
      >
        <Typography
          variant="h6"
          fontWeight="700"
          mb={3}
        >
          🤖 AI Insights & Recommendations
        </Typography>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          {summary.criticalRisks > 0 && (
            <Paper
              sx={{
                p: 2,
                bgcolor: "#FEE2E2",
                borderLeft: "5px solid #EF4444",
              }}
            >
              🔴 Resolve all critical risks immediately.
            </Paper>
          )}

          {summary.openRisks > 3 && (
            <Paper
              sx={{
                p: 2,
                bgcolor: "#FEF3C7",
                borderLeft: "5px solid #F59E0B",
              }}
            >
              🟠 Multiple risks are still open. Assign owners and mitigation plans.
            </Paper>
          )}

          {summary.totalProjects > 0 &&
            summary.totalRisks / summary.totalProjects > 2 && (
              <Paper
                sx={{
                  p: 2,
                  bgcolor: "#DBEAFE",
                  borderLeft: "5px solid #3B82F6",
                }}
              >
                🔵 Risk density is high. Increase project monitoring frequency.
              </Paper>
            )}

          {summary.criticalRisks === 0 &&
            summary.openRisks <= 3 && (
              <Paper
                sx={{
                  p: 2,
                  bgcolor: "#D1FAE5",
                  borderLeft: "5px solid #10B981",
                }}
              >
                ✅ Projects are healthy. Continue weekly risk reviews.
              </Paper>
            )}
        </Box>
      </Paper>

      <Paper
        sx={{
          mt: 4,
          p: 4,
          borderRadius: 3,
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Typography
            variant="h6"
            fontWeight="bold"
          >
            Top Critical Risks
          </Typography>

          <Button
            size="small"
            onClick={() => navigate("/risks")}
          >
            View All →
          </Button>
        </Box>

        {topCriticalRisks.length === 0 ? (
          <Typography color="text.secondary">
            No Critical Risks
          </Typography>
        ) : (
          topCriticalRisks.map((risk) => (
            <Paper
              key={risk.id}
              sx={{
                p: 2,
                mb: 2,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderRadius: 2,
                border: "1px solid #E5E7EB",
              }}
            >
              <Box>
                <Typography fontWeight="bold">
                  {risk.title}
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  Score : {risk.score}
                </Typography>
              </Box>

              <Chip
                label={risk.level}
                color={
                  risk.level === "CRITICAL"
                    ? "error"
                    : "warning"
                }
              />
            </Paper>
          ))
        )}
      </Paper>

      <Paper
        sx={{
          mt: 4,
          p: 4,
          borderRadius: 3,
        }}
      >
        <Typography
          variant="h6"
          fontWeight="bold"
          mb={3}
        >
          Project Health Overview
        </Typography>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              md: "repeat(2,1fr)",
              lg: "repeat(3,1fr)",
            },
            gap: 3,
          }}
        >
          {projectHealthCards.map((project) => (
            <Paper
              key={project.id}
              sx={{
                p: 3,
                borderRadius: 3,
                border: "1px solid #E5E7EB",
              }}
            >
              <Typography
                variant="h6"
                fontWeight="bold"
              >
                {project.name}
              </Typography>

              <Typography
                variant="h4"
                sx={{
                  mt: 2,
                  mb: 2,
                  color:
                    project.score >= 80
                      ? "#16A34A"
                      : project.score >= 60
                      ? "#F59E0B"
                      : "#DC2626",
                }}
              >
                {project.score}%
              </Typography>

              <Chip
                label={project.status}
                color={
                  project.status === "Healthy"
                    ? "success"
                    : project.status === "Warning"
                    ? "warning"
                    : "error"
                }
              />

              <Button
                fullWidth
                sx={{ mt: 3 }}
                variant="outlined"
                onClick={() => navigate("/project-health")}
              >
                View Project
              </Button>
            </Paper>
          ))}
        </Box>
      </Paper>

      <Paper
        sx={{
          mt: 4,
          p: 4,
          borderRadius: 3,
        }}
      >
        <Typography
          variant="h6"
          fontWeight="bold"
          mb={3}
        >
          Recent Activity
        </Typography>

        {recentActivity.map((activity) => (
          <Box
            key={activity.id}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              py: 2,
              borderBottom: "1px solid #E5E7EB",
            }}
          >
            <Typography>
              {activity.message}
            </Typography>

            <Typography
              color="text.secondary"
              fontSize={13}
            >
              {activity.time}
            </Typography>
          </Box>
        ))}
      </Paper>


    </div>
  );
}

export default Dashboard;