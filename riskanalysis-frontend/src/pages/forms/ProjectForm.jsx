import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Card,
  CardContent,
  Typography,
  TextField,
  MenuItem,
  Grid,
  Button,
  Stack,
  Box
} from "@mui/material";
import API from "../../services/api";

const initialProject = {
  name: "",
  description: "",
  startDate: "",
  endDate: "",
  budget: "",
  status: "PLANNING",
  managerId: 1
};

function ProjectForm() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [project, setProject] = useState(initialProject);

  useEffect(() => {
    if (id) loadProject();
  }, [id]);

  const loadProject = async () => {
    try {
      const res = await API.get(`/projects/${id}`);

      setProject({
        name: res.data.name ?? "",
        description: res.data.description ?? "",
        startDate: res.data.startDate ?? "",
        endDate: res.data.endDate ?? "",
        budget: res.data.budget ?? "",
        status: res.data.status ?? "PLANNING",
        managerId: res.data.manager?.id ?? 1
      });
    } catch (err) {
      console.log(err);
    }
  };

  const handleChange = (e) => {
    setProject({
      ...project,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = async () => {
    try {
      const payload = {
        name: project.name,
        description: project.description,
        startDate: project.startDate,
        endDate: project.endDate,
        budget: Number(project.budget),
        status: project.status,
        managerId: Number(project.managerId)
      };

      if (id) {
        await API.put(`/projects/${id}`, payload);
      } else {
        await API.post("/projects", payload);
      }

      navigate("/projects");
    } catch (err) {
      console.log(err.response);
      alert("Unable to save project");
    }
  };

  return (
    <Box
      sx={{
        bgcolor: "#f5f7fb",
        minHeight: "100vh",
        py: 5
      }}
    >
      <Card
        sx={{
          maxWidth: 1350,
          mx: "auto",
          borderRadius: 4,
          boxShadow: 6
        }}
      >
        <CardContent sx={{ p: 5 }}>

          <Typography
            variant="h4"
            fontWeight="bold"
            gutterBottom
          >
            {id ? "Edit Project" : "Create New Project"}
          </Typography>

          <Typography
            color="text.secondary"
            sx={{ mb: 5 }}
          >
            Projects / {id ? "Edit Project" : "New Project"}
          </Typography>

          <Grid container spacing={4}>

            <Grid item xs={12} md={6}>
              <TextField
                label="Project Name"
                name="name"
                value={project.name}
                onChange={handleChange}
                fullWidth
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Budget (₹)"
                name="budget"
                type="number"
                value={project.budget}
                onChange={handleChange}
                fullWidth
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Description"
                name="description"
                value={project.description}
                onChange={handleChange}
                multiline
                rows={5}
                fullWidth
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography
                variant="body2"
                sx={{
                  mb: 1,
                  fontWeight: 600,
                  color: "text.secondary",
                }}
              >
                Start Date
              </Typography>

              <TextField
                fullWidth
                name="startDate"
                type="date"
                value={project.startDate}
                onChange={handleChange}
                InputLabelProps={{
                  shrink: true,
                }}
                inputProps={{
                  style: {
                    padding: "16.5px 14px",
                  },
                }}
                sx={{
                  "& input::-webkit-datetime-edit": {
                    color: project.startDate ? "#000" : "transparent",
                  },
                  "& input:focus::-webkit-datetime-edit": {
                    color: "#000",
                  },
                }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography
                variant="body2"
                sx={{
                  mb: 1,
                  fontWeight: 600,
                  color: "text.secondary",
                }}
              >
                End Date
              </Typography>

              <TextField
                fullWidth
                name="endDate"
                type="date"
                value={project.endDate}
                onChange={handleChange}
                InputLabelProps={{
                  shrink: true,
                }}
                inputProps={{
                  style: {
                    padding: "16.5px 14px",
                  },
                }}
                sx={{
                  "& input::-webkit-datetime-edit": {
                    color: project.endDate ? "#000" : "transparent",
                  },
                  "& input:focus::-webkit-datetime-edit": {
                    color: "#000",
                  },
                }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                select
                label="Project Status"
                name="status"
                value={project.status}
                onChange={handleChange}
                fullWidth
              >
                <MenuItem value="PLANNING">Planning</MenuItem>
                <MenuItem value="ACTIVE">Active</MenuItem>
                <MenuItem value="ON_HOLD">On Hold</MenuItem>
                <MenuItem value="COMPLETED">Completed</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Manager ID"
                name="managerId"
                type="number"
                value={project.managerId}
                onChange={handleChange}
                fullWidth
              />
            </Grid>

          </Grid>

          <Stack
            direction="row"
            justifyContent="flex-end"
            spacing={2}
            sx={{ mt: 6 }}
          >
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate("/projects")}
            >
              Cancel
            </Button>

            <Button
              variant="contained"
              size="large"
              onClick={handleSave}
            >
              {id ? "Update Project" : "Create Project"}
            </Button>
          </Stack>

        </CardContent>
      </Card>
    </Box>
  );
}

export default ProjectForm;