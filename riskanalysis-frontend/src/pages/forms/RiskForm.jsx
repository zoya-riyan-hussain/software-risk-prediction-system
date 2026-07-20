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
  Stack
} from "@mui/material";
import API from "../../services/api";

const initialRisk = {
  title: "",
  description: "",
  category: "TECHNICAL",
  severity: "MEDIUM",
  status: "OPEN",
  probability: "",
  impact: "",
  projectId: "",
  ownerId: 1,
  mitigationPlan: "",
  identifiedDate: "",
  dueDate: ""
};

function RiskForm() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [risk, setRisk] = useState(initialRisk);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);

const handleChange = (e) => {
  const { name, value } = e.target;

  if (name === "probability" || name === "impact") {
    setRisk((prev) => ({
      ...prev,
      [name]: value === "" ? "" : Number(value),
    }));
  } else {
    setRisk((prev) => ({
      ...prev,
      [name]:
        name === "projectId" || name === "ownerId"
          ? Number(value)
          : value,
    }));
  }
};

useEffect(() => {
  loadProjects();
  loadUsers();

  if (id) {
    loadRisk();
  }
}, [id]);

const loadProjects = async () => {
  try {
    const res = await API.get("/projects");
    console.log("Projects:", res.data);
    setProjects(res.data);

    if (!id && res.data.length > 0) {
      setRisk(prev => ({
        ...prev,
        projectId: res.data[0].id
      }));
    }
  } catch (err) {
    console.log(err);
  }
};

const loadUsers = async () => {
  try {
    const res = await API.get("/users");
    setUsers(res.data);

    if (!id && res.data.length > 0) {
      setRisk(prev => ({
        ...prev,
        ownerId: res.data[0].id
      }));
    }

  } catch (err) {
    console.log(err);
  }
};

  const loadRisk = async () => {
    try {
      const res = await API.get(`/risks/${id}`);

      setRisk({
        title: res.data.title || "",
        description: res.data.description || "",
        category: res.data.category || "SCHEDULE",
        severity: res.data.level || "MEDIUM",
        status: res.data.status || "OPEN",
        probability: res.data.probability ?? "",
        impact: res.data.impact ?? "",
        projectId: res.data.project?.id || 1,
        ownerId: res.data.owner?.id || 1,
        mitigationPlan: res.data.mitigationPlan || "",
        identifiedDate: res.data.identifiedDate || "",
        dueDate: res.data.dueDate || ""
      });
    } catch (err) {
      console.log(err);
      alert("Unable to load risk.");
    }
  };

 const handleSave = async () => {

   if (
     risk.probability === "" ||
     risk.impact === "" ||
     risk.probability < 1 ||
     risk.probability > 5 ||
     risk.impact < 1 ||
     risk.impact > 5
   ) {
     alert("Probability and Impact must be between 1 and 5.");
     return;
   }

   try {

     const payload = {
       title: risk.title,
       description: risk.description,
       category: risk.category,
       probability: Number(risk.probability),
       impact: Number(risk.impact),
       mitigationPlan: risk.mitigationPlan,
       identifiedDate: risk.identifiedDate,
       dueDate: risk.dueDate,
       projectId: risk.projectId,
       ownerId: Number(risk.ownerId)
     };

     if (id) {
       await API.put(`/risks/${id}`, payload);
     } else {
       await API.post("/risks", payload);
     }

     navigate("/risks");

   } catch (err) {
     console.log(err);
     alert("Unable to save risk.");
   }
 };

  return (
    <Card sx={{ maxWidth: 900, mx: "auto", mt: 4, borderRadius: 3 }}>
      <CardContent>
        <Typography
          variant="h4"
          fontWeight="bold"
          sx={{ mb: 5 }}
        >
          {id ? "Edit Risk" : "Create Risk"}
        </Typography>

        <Grid container spacing={3}>

          <Grid item xs={12}>
            <TextField
              label="Risk Title"
              name="title"
              value={risk.title}
              onChange={handleChange}
              fullWidth
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Description"
              name="description"
              value={risk.description}
              onChange={handleChange}
              multiline
              rows={4}
              fullWidth
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              label="Probability"
              name="probability"
              type="number"
              value={risk.probability}
              onChange={handleChange}
              inputProps={{ min: 1, max: 5 }}
              fullWidth
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              label="Impact Score"
              name="impact"
              type="number"
              value={risk.impact}
              onChange={handleChange}
              inputProps={{ min: 1, max: 5 }}
              fullWidth
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              select
              label="Category"
              name="category"
              value={risk.category}
              onChange={handleChange}
              fullWidth
            >
              <MenuItem value="TECHNICAL">Technical</MenuItem>
              <MenuItem value="SCHEDULE">Schedule</MenuItem>
              <MenuItem value="BUDGET">Budget</MenuItem>
              <MenuItem value="RESOURCE">Resource</MenuItem>
              <MenuItem value="SECURITY">Security</MenuItem>
              <MenuItem value="QUALITY">Quality</MenuItem>
              <MenuItem value="REQUIREMENT">Requirement</MenuItem>
              <MenuItem value="COMMUNICATION">Communication</MenuItem>
            </TextField>
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              select
              label="Severity"
              name="severity"
              value={risk.severity}
              onChange={handleChange}
              fullWidth
            >
              <MenuItem value="LOW">Low</MenuItem>
              <MenuItem value="MEDIUM">Medium</MenuItem>
              <MenuItem value="HIGH">High</MenuItem>
              <MenuItem value="CRITICAL">Critical</MenuItem>
            </TextField>
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              select
              label="Status"
              name="status"
              value={risk.status}
              onChange={handleChange}
              fullWidth
            >
              <MenuItem value="OPEN">Open</MenuItem>
              <MenuItem value="MITIGATED">Mitigated</MenuItem>
              <MenuItem value="CLOSED">Closed</MenuItem>
            </TextField>
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              select
              label="Project"
              name="projectId"
              value={risk.projectId}
              onChange={handleChange}
              fullWidth
            >
              {projects.map((project) => (
                <MenuItem key={project.id} value={project.id}>
                  {project.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              select
              fullWidth
              label="Owner"
              name="ownerId"
              value={risk.ownerId}
              onChange={handleChange}
            >
              {users.map((user) => (
                <MenuItem
                  key={user.id}
                  value={user.id}
                >
                  {user.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Mitigation Plan"
              name="mitigationPlan"
              value={risk.mitigationPlan}
              onChange={handleChange}
              multiline
              rows={3}
              fullWidth
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              type="date"
              name="identifiedDate"
              label="Identified Date"
              value={risk.identifiedDate}
              onChange={handleChange}
              slotProps={{
                inputLabel: {
                  shrink: true,
                },
              }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
           <TextField
             fullWidth
             type="date"
             name="dueDate"
             label="Due Date"
             value={risk.dueDate}
             onChange={handleChange}
             slotProps={{
               inputLabel: {
                 shrink: true,
               },
             }}
           />
          </Grid>

        </Grid>

        <Stack
          direction="row"
          spacing={2}
          justifyContent="flex-end"
          sx={{ mt: 6 }}
        >
          <Button
            variant="outlined"
            size="large"
            sx={{ minWidth: 130 }}
            onClick={() => navigate("/risks")}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            size="large"
            sx={{ minWidth: 150 }}
            onClick={handleSave}
          >
            {id ? "Update Risk" : "Save Risk"}
          </Button>
        </Stack>

              </CardContent>
            </Card>
          );
        }

        export default RiskForm;