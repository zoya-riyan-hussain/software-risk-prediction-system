import { useEffect, useState, useRef } from "react";
import {
  Paper,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  LinearProgress,
  Box,
  CircularProgress,
  Button,
} from "@mui/material";
import API from "../services/api";

import jsPDF from "jspdf";
import html2canvas from "html2canvas";

function ProjectHealth() {
  const [projects, setProjects] = useState([]);
  const [projectId, setProjectId] = useState("");
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(false);

  const reportRef = useRef();

  useEffect(() => {
    API.get("/projects")
      .then((res) => setProjects(res.data))
      .catch((err) => console.log(err));
  }, []);

  const loadHealth = (id) => {
    setProjectId(id);

    if (!id) return;

    setLoading(true);

    API.get(`/dashboard/project-health/${id}`)
      .then((res) => {
        setHealth(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  const exportProjectReport = async () => {
    const canvas = await html2canvas(reportRef.current);

    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");

    const width = 190;
    const height = (canvas.height * width) / canvas.width;

    pdf.setFontSize(18);
    pdf.text("Software Project Risk Report", 10, 15);

    pdf.addImage(imgData, "PNG", 10, 25, width, height);

    pdf.save(`${health.projectName}_Report.pdf`);
  };

  return (
    <Box ref={reportRef}>
      <Typography variant="h4" fontWeight="bold" mb={3}>
        Project Health Dashboard
      </Typography>

      <Button
        variant="contained"
        color="success"
        onClick={exportProjectReport}
        sx={{ mb: 3 }}
      >
        Export Project Report
      </Button>

      <Paper sx={{ p: 3, mb: 3 }}>
        <FormControl fullWidth>
          <InputLabel>Select Project</InputLabel>

          <Select
            value={projectId}
            label="Select Project"
            onChange={(e) => loadHealth(e.target.value)}
          >
            {projects.map((project) => (
              <MenuItem key={project.id} value={project.id}>
                {project.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Paper>

      {loading && (
        <Box sx={{ textAlign: "center", mt: 5 }}>
          <CircularProgress />
        </Box>
      )}

      {health && (
        <Paper sx={{ p: 4 }}>
          <Typography variant="h5" gutterBottom>
            {health.projectName}
          </Typography>

          <Typography sx={{ mt: 2 }}>
            <b>Health Status:</b> {health.healthStatus}
          </Typography>

          <Typography>
            <b>Health Score:</b> {health.healthScore}%
          </Typography>

          <LinearProgress
            variant="determinate"
            value={health.healthScore}
            sx={{
              mt: 2,
              height: 12,
              borderRadius: 5,
            }}
          />

          <Typography sx={{ mt: 3 }}>
            <b>Total Risks:</b> {health.totalRisks}
          </Typography>

          <Typography>
            <b>Open Risks:</b> {health.openRisks}
          </Typography>

          <Typography>
            <b>Critical Risks:</b> {health.criticalRisks}
          </Typography>
        </Paper>
      )}
    </Box>
  );
}

export default ProjectHealth;