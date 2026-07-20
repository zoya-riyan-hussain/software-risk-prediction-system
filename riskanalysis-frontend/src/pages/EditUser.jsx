import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  MenuItem,
} from "@mui/material";

import Grid from "@mui/material/Grid";

import API from "../services/api";

function EditUser() {

  const { id } = useParams();
  const navigate = useNavigate();

  const [teams, setTeams] = useState([]);

  const [user, setUser] = useState({
    name: "",
    email: "",
    role: "",
    teamId: "",
  });

  useEffect(() => {
    loadUser();
    loadTeams();
  }, []);

  const loadTeams = async () => {
    try {
      const res = await API.get("/teams");
      setTeams(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const loadUser = async () => {
    try {

      const res = await API.get(`/users/${id}`);

      setUser({
        name: res.data.name,
        email: res.data.email,
        role: res.data.role,
        teamId: res.data.team?.id || "",
      });

    } catch (err) {
      console.log(err);
    }
  };

  const handleChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };

  const updateUser = async () => {

    try {

      const payload = {
        ...user,
        teamId: user.teamId === "" ? null : Number(user.teamId),
      };

      await API.put(`/users/${id}`, payload);

      alert("User updated successfully");

      navigate("/users");

    } catch (err) {

      console.log(err);

      alert("Unable to update user");
    }
  };

  return (
    <Box>

      <Typography
        variant="h4"
        fontWeight={700}
        mb={4}
      >
        Edit User
      </Typography>

      <Paper
        sx={{
          p: 4,
          borderRadius: 4,
        }}
      >
        <Grid container spacing={3}>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              label="Full Name"
              name="name"
              value={user.name}
              onChange={handleChange}
              fullWidth
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              label="Email"
              name="email"
              value={user.email}
              onChange={handleChange}
              fullWidth
            />
          </Grid>



          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              select
              label="Role"
              name="role"
              value={user.role}
              onChange={handleChange}
              fullWidth
            >
              <MenuItem value="ADMIN">Admin</MenuItem>

              <MenuItem value="PROJECT_MANAGER">
                Project Manager
              </MenuItem>

              <MenuItem value="TEAM_LEAD">
                Team Lead
              </MenuItem>

              <MenuItem value="DEVELOPER">
                Developer
              </MenuItem>

              <MenuItem value="VIEWER">
                Viewer
              </MenuItem>
            </TextField>
          </Grid>

          <Grid
            size={12}
            sx={{
              mb: 2,
            }}
          >
            <TextField
              select
              label="Assign Team"
              name="teamId"
              value={user.teamId}
              onChange={handleChange}
              fullWidth
            >
              <MenuItem value="">
                None
              </MenuItem>

              {teams.map((team) => (
                <MenuItem
                  key={team.id}
                  value={team.id}
                >
                  {team.teamName}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

        </Grid>

        <Box
          sx={{
            mt: 5,
            display: "flex",
            gap: 2,
            pt: 2,
          }}
        >
          <Button
            variant="contained"
            onClick={updateUser}
            sx={{
              minWidth: 170,
              height: 48,
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 600,
            }}
          >
            Update User
          </Button>

          <Button
            variant="outlined"
            onClick={() => navigate("/users")}
            sx={{
              minWidth: 130,
              height: 48,
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 600,
            }}
          >
            Cancel
          </Button>
        </Box>

      </Paper>

    </Box>
  );
}

export default EditUser;