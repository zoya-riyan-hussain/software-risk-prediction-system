import { useEffect, useState } from "react";
import {
  Paper,
  Typography,
  TextField,
  MenuItem,
  Button,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function AddUser() {

  const navigate = useNavigate();

  const [teams, setTeams] = useState([]);

  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    role: "DEVELOPER",
    teamId: "",
  });

  useEffect(() => {
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

  const handleChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };

  const saveUser = async () => {
    try {

      const payload = {
        name: user.name,
        email: user.email,
        password: user.password,
        role: user.role,
        teamId: user.teamId === "" ? null : Number(user.teamId),
      };

      await API.post("/users", payload);

      alert("User created successfully");

      navigate("/users");

    } catch (err) {
      console.log(err);
      alert("Unable to create user");
    }
  };

  return (
    <Paper
      sx={{
        p: 4,
        borderRadius: 4,
      }}
    >
      <Typography
        variant="h4"
        fontWeight={700}
        mb={4}
      >
        Add New User
      </Typography>

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
            label="Password"
            name="password"
            type="password"
            value={user.password}
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

        <Grid size={12}>
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

      <Button
        variant="contained"
        sx={{ mt: 4 }}
        onClick={saveUser}
      >
        Create User
      </Button>

    </Paper>
  );
}

export default AddUser;