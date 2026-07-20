import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Grid,
  Typography
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

function ProjectDialog({ open, handleClose, refreshProjects, project }) {
  const [projectData, setProjectData] = useState(initialProject);

  useEffect(() => {
    if (project) {
      setProjectData({
        id: project.id,
        name: project.name || "",
        description: project.description || "",
        startDate: project.startDate || "",
        endDate: project.endDate || "",
        budget: project.budget || "",
        status: project.status || "PLANNING",
        managerId: project.manager?.id || 1
      });
    } else {
      setProjectData(initialProject);
    }
  }, [project, open]);

  const handleChange = (e) => {
    setProjectData({
      ...projectData,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = async () => {
    try {
      const payload = {
        name: projectData.name,
        description: projectData.description,
        startDate: projectData.startDate,
        endDate: projectData.endDate,
        budget: Number(projectData.budget),
        status: projectData.status,
        managerId: Number(projectData.managerId)
      };

      if (projectData.id) {
        await API.put(`/projects/${projectData.id}`, payload);
      } else {
        await API.post("/projects", payload);
      }

      refreshProjects();
      handleClose();
      setProjectData(initialProject);
    } catch (error) {
      console.log(error.response);
      alert("Unable to save project.");
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="md"
      PaperProps={{
        sx: {
          borderRadius: 3,
          p: 1
        }
      }}
    >
      <DialogTitle sx={{ pb: 0 }}>
        <Typography variant="h5" fontWeight="bold">
          {projectData.id ? "Edit Project" : "Create New Project"}
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ mt: 2 }}>
        <Grid container spacing={3}>

          <Grid item xs={12} md={6}>
            <TextField
              label="Project Name"
              name="name"
              value={projectData.name}
              onChange={handleChange}
              fullWidth
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              label="Budget (₹)"
              name="budget"
              type="number"
              value={projectData.budget}
              onChange={handleChange}
              fullWidth
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Description"
              name="description"
              value={projectData.description}
              onChange={handleChange}
              multiline
              rows={4}
              fullWidth
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              type="date"
              label="Start Date"
              name="startDate"
              value={projectData.startDate}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              type="date"
              label="End Date"
              name="endDate"
              value={projectData.endDate}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              select
              label="Project Status"
              name="status"
              value={projectData.status}
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
              value={projectData.managerId}
              onChange={handleChange}
              fullWidth
            />
          </Grid>

        </Grid>
      </DialogContent>

      <DialogActions
        sx={{
          px: 3,
          py: 2
        }}
      >
        <Button
          variant="outlined"
          onClick={handleClose}
        >
          Cancel
        </Button>

        <Button
          variant="contained"
          onClick={handleSave}
        >
          {projectData.id ? "Update Project" : "Create Project"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ProjectDialog;