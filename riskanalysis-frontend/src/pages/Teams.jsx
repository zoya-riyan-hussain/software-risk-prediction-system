import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  IconButton,
} from "@mui/material";
import API from "../services/api";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import {
  getTeams,
  createTeam,
  updateTeam,
  deleteTeam,
} from "../services/teamService";

function Teams() {

  const [teams, setTeams] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [projects, setProjects] = useState([]);

  const [team, setTeam] = useState({
    teamName: "",
    description: "",
    projectId: "",
  });

const loadTeams = async () => {
  try {
    const teamRes = await getTeams();
    setTeams(teamRes.data);

    const projectRes = await API.get("/projects");

    console.log("Projects API Response:", projectRes.data);

    console.log("PROJECTS =", projectRes.data);

    setProjects(projectRes.data);
  } catch (err) {
    console.log(err);
  }
};
useEffect(() => {
  loadTeams();
}, []);

  const handleChange = (e) => {
    setTeam({
      ...team,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async () => {
    try {

      if (editingId) {
        await updateTeam(editingId, team);
      } else {
        await createTeam(team);
      }

      setOpen(false);

      setEditingId(null);

      setTeam({
        teamName: "",
        description: "",
        projectId: "",
      });

      loadTeams();

    } catch (err) {
      console.log(err);
      console.log(err.response);
      console.log(err.response?.data);

      alert(
        err.response?.data?.message ||
        JSON.stringify(err.response?.data) ||
        "Unable to save team"
      );
    }
  };

  const handleEdit = (t) => {

    setEditingId(t.id);

    setTeam({
      teamName: t.teamName,
      description: t.description,
      projectId: t.project?.id || "",
    });

    setOpen(true);

  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          mb: 4,
        }}
      >
        <Typography
          variant="h4"
          fontWeight={700}
        >
          Teams
        </Typography>

        <Button
          variant="contained"
          onClick={() => setOpen(true)}
        >
          + Add Team
        </Button>
      </Box>

      <Paper>

        <TableContainer>

          <Table>

            <TableHead>
              <TableRow>
                <TableCell><b>ID</b></TableCell>
                <TableCell><b>Team</b></TableCell>
                <TableCell><b>Description</b></TableCell>
                <TableCell><b>Project</b></TableCell>
                <TableCell><b>Members</b></TableCell>
                <TableCell><b>Actions</b></TableCell>
              </TableRow>
            </TableHead>

            <TableBody>

              {teams.map((t) => (

                <TableRow key={t.id}>

                  <TableCell>{t.id}</TableCell>

                  <TableCell>{t.teamName}</TableCell>

                  <TableCell>{t.description}</TableCell>

                  <TableCell>
                    {t.project?.name}
                  </TableCell>

                  <TableCell>
                    <Typography fontWeight={600}>
                      {t.members?.length || 0} Member(s)
                    </Typography>

                    <Typography
                      variant="caption"
                      color="text.secondary"
                    >
                      {t.members?.length > 0
                        ? t.members.map((m) => m.name).join(", ")
                        : "No Members"}
                    </Typography>
                  </TableCell>

                  <TableCell align="center">

                    <IconButton
                      color="warning"
                      onClick={() => handleEdit(t)}
                    >
                      <EditIcon />
                    </IconButton>

                    <IconButton
                      color="error"
                      onClick={async () => {

                        if(window.confirm("Delete Team?")){

                          await deleteTeam(t.id);

                          loadTeams();

                        }

                      }}
                    >
                      <DeleteIcon />
                    </IconButton>

                  </TableCell>

                </TableRow>

              ))}

            </TableBody>

          </Table>

        </TableContainer>

      </Paper>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth="sm"
      >

        <DialogTitle>

          {editingId
            ? "Edit Team"
            : "Create Team"}

        </DialogTitle>

        <DialogContent>

          <TextField
            margin="normal"
            label="Team Name"
            name="teamName"
            value={team.teamName}
            onChange={handleChange}
            fullWidth
          />

          <TextField
            margin="normal"
            label="Description"
            name="description"
            value={team.description}
            onChange={handleChange}
            fullWidth
          />

          <TextField
            select
            margin="normal"
            label="Project"
            name="projectId"
            value={team.projectId}
            onChange={handleChange}
            fullWidth
          >
            {projects.map((project) => (
              <MenuItem
                key={project.id}
                value={project.id}
              >
                {project.name}
              </MenuItem>
            ))}
          </TextField>

        </DialogContent>

        <DialogActions>

          <Button
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={handleSave}
          >
            Save
          </Button>

        </DialogActions>

      </Dialog>

    </>
  );
}

export default Teams;