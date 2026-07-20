import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  Button,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Chip,
  TextField,
  MenuItem,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import API from "../services/api";
import EditIcon from "@mui/icons-material/Edit";

function Users() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const loadUsers = async () => {
    try {
      const res = await API.get("/users");

      console.log(res.data);

      if (Array.isArray(res.data)) {
        setUsers(res.data);
      } else if (Array.isArray(res.data.content)) {
        setUsers(res.data.content);
      } else {
        setUsers([]);
      }
    } catch (err) {
      console.log(err);
      setUsers([]);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const totalUsers = users.length;

  const admins = users.filter(
    (u) => u.role === "ADMIN"
  ).length;

  const projectManagers = users.filter(
    (u) => u.role === "PROJECT_MANAGER"
  ).length;

  const teamLeads = users.filter(
    (u) => u.role === "TEAM_LEAD"
  ).length;

  const developers = users.filter(
    (u) => u.role === "DEVELOPER"
  ).length;

  const viewers = users.filter(
    (u) => u.role === "VIEWER"
  ).length;

  return (
    <>
      <Box
        sx={{
          mb: 5,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Box>
          <Typography variant="h4" fontWeight={700}>
            User Management
          </Typography>

          <Typography
            color="text.secondary"
            sx={{ mt: 0.5 }}
          >
            Manage project users and their roles
          </Typography>
        </Box>

        <Button
          variant="contained"
          size="large"
          onClick={() => navigate("/users/new")}
        >
          + Add User
        </Button>
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2,1fr)",
              lg: "repeat(6,1fr)",
          },
          gap: 3,
          mb: 5,
        }}
      >
        <Paper sx={{ p: 3, borderRadius: 4 }}>
          <Typography color="text.secondary">
            Total Users
          </Typography>

          <Typography variant="h3" fontWeight={700}>
            {totalUsers}
          </Typography>
        </Paper>

        <Paper sx={{ p: 3, borderRadius: 4 }}>
          <Typography color="text.secondary">
            Admins
          </Typography>

          <Typography
            variant="h3"
            fontWeight={700}
            color="error.main"
          >
            {admins}
          </Typography>
        </Paper>

        <Paper sx={{ p: 3, borderRadius: 4 }}>
          <Typography color="text.secondary">
            Project Managers
          </Typography>

          <Typography
            variant="h3"
            fontWeight={700}
            color="warning.main"
          >
            {projectManagers}
          </Typography>
        </Paper>

        <Paper sx={{ p: 3, borderRadius: 4 }}>
          <Typography color="text.secondary">
            Developers
          </Typography>

          <Typography
            variant="h3"
            fontWeight={700}
            color="success.main"
          >
            {developers}
          </Typography>
        </Paper>
        <Paper sx={{ p: 3, borderRadius: 4 }}>
          <Typography color="text.secondary">
            Team Leads
          </Typography>

          <Typography
            variant="h3"
            fontWeight={700}
            color="info.main"
          >
            {teamLeads}
          </Typography>
        </Paper>
        <Paper sx={{ p: 3, borderRadius: 4 }}>
          <Typography color="text.secondary">
            Viewers
          </Typography>

          <Typography
            variant="h3"
            fontWeight={700}
            color="text.primary"
          >
            {viewers}
          </Typography>
        </Paper>
      </Box>

      <Paper
        sx={{
          p: 3,
          mb: 4,
          borderRadius: 4,
        }}
      >
        <Typography
          variant="h6"
          fontWeight={700}
          mb={3}
        >
          Search Users
        </Typography>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              md: "2fr 1fr",
            },
            gap: 3,
          }}
        >
          <TextField
            label="Search User"
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            fullWidth
          />

          <TextField
            select
            label="Role"
            value={roleFilter}
            onChange={(e) =>
              setRoleFilter(e.target.value)
            }
            fullWidth
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="ADMIN">
              Admin
            </MenuItem>
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
        </Box>

        <Box
          sx={{
            mt: 3,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <Typography color="text.secondary">
            Showing{" "}
            <b>
              {
                users
                  .filter((u) =>
                    u.name.toLowerCase().includes(search.toLowerCase())
                  )
                  .filter((u) =>
                    roleFilter ? u.role === roleFilter : true
                  ).length
              }
            </b>{" "}
            user(s)
          </Typography>

          <Button
            variant="outlined"
            onClick={() => {
              setSearch("");
              setRoleFilter("");
            }}
          >
            Clear Filters
          </Button>
        </Box>
      </Paper>

      <Paper
        elevation={3}
        sx={{
          borderRadius: 4,
          overflow: "hidden",
          border: "1px solid #E2E8F0",
          mb: 5,
        }}
      >

      <Box
        sx={{
          px: 3,
          py: 2.5,
          bgcolor: "#F8FAFC",
          borderBottom: "1px solid #E2E8F0",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography
          variant="h6"
          fontWeight={700}
        >
          👥 Users List
        </Typography>

        <Typography color="text.secondary">
          {users.length} Total Users
        </Typography>
      </Box>

        <TableContainer
          sx={{
            maxHeight: 650,
          }}
        >
          <Table stickyHeader>

            <TableHead>
              <TableRow>
                <TableCell>
                  <b>ID</b>
                </TableCell>

                <TableCell>
                  <b>Name</b>
                </TableCell>

                <TableCell>
                  <b>Email</b>
                </TableCell>

                <TableCell>
                  <b>Role</b>
                </TableCell>

                <TableCell>
                  <b>Team</b>
                </TableCell>

                <TableCell align="center">
                  <b>Actions</b>
                </TableCell>
              </TableRow>

            </TableHead>

            <TableBody>

              {users
                .filter((u) =>
                  u.name
                    ?.toLowerCase()
                    .includes(search.toLowerCase())
                )
                .filter((u) =>
                  roleFilter
                    ? u.role === roleFilter
                    : true
                )
                .map((user) => (
                  <TableRow key={user.id} hover>

                   <TableCell>
                     #{user.id}
                   </TableCell>

                    <TableCell>
                      <Typography fontWeight={700}>
                        {user.name}
                      </Typography>

                      <Typography
                        variant="caption"
                        color="text.secondary"
                      >
                        Team Member
                      </Typography>
                    </TableCell>

                    <TableCell>
                      {user.email}
                    </TableCell>

                    <TableCell>
                      <Chip
                        label={user.role}
                        color={
                          user.role === "ADMIN"
                            ? "error"
                            : user.role === "PROJECT_MANAGER"
                            ? "warning"
                            : user.role === "TEAM_LEAD"
                            ? "info"
                            : user.role === "DEVELOPER"
                            ? "success"
                            : "default"
                        }
                      />
                    </TableCell>

                    <TableCell>
                      {user.team ? user.team.teamName : "-"}
                    </TableCell>

                    <TableCell align="center">

                      <IconButton
                        color="info"
                        onClick={() => {
                          setSelectedUser(user);
                          setOpen(true);
                        }}
                      >
                        <VisibilityIcon />
                      </IconButton>

                      <IconButton
                        color="warning"
                        onClick={() =>
                          navigate(`/users/edit/${user.id}`)
                        }
                      >
                        <EditIcon />
                      </IconButton>

                      <IconButton
                        color="error"
                        onClick={async () => {
                          if (
                            window.confirm(
                              "Delete this user?"
                            )
                          ) {
                            await API.delete(
                              `/users/${user.id}`
                            );
                            loadUsers();
                          }
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>

                    </TableCell>

                  </TableRow>
                ))}

            {users
              .filter((u) =>
                u.name.toLowerCase().includes(search.toLowerCase())
              )
              .filter((u) =>
                roleFilter ? u.role === roleFilter : true
              ).length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    align="center"
                    sx={{ py: 8 }}
                  >
                    <Typography
                      variant="h6"
                      color="text.secondary"
                    >
                      No Users Found
                    </Typography>

                    <Typography color="text.secondary">
                      Try changing the search or filter.
                    </Typography>
                  </TableCell>
                </TableRow>
            )}

            </TableBody>

          </Table>
        </TableContainer>
      </Paper>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          User Details
        </DialogTitle>

        <DialogContent>

          {selectedUser && (
            <Box
              sx={{
                display: "grid",
                gap: 2,
                mt: 2,
              }}
            >
              <Paper sx={{ p: 3 }}>
                <Typography color="text.secondary">
                  Name
                </Typography>

                <Typography variant="h6">
                  {selectedUser.name}
                </Typography>
              </Paper>

              <Paper sx={{ p: 3 }}>
                <Typography color="text.secondary">
                  Email
                </Typography>

                <Typography variant="h6">
                  {selectedUser.email}
                </Typography>
              </Paper>

              <Paper sx={{ p: 3 }}>
                <Typography color="text.secondary">
                  Role
                </Typography>

                <Chip
                  sx={{ mt: 1 }}
                  label={selectedUser.role}
                  color={
                    selectedUser.role === "ADMIN"
                      ? "error"
                      : selectedUser.role === "PROJECT_MANAGER"
                      ? "warning"
                      : selectedUser.role === "TEAM_LEAD"
                      ? "info"
                      : selectedUser.role === "DEVELOPER"
                      ? "success"
                      : "default"
                  }
                />
              </Paper>
              <Paper sx={{ p: 3 }}>
                <Typography color="text.secondary">
                  Team
                </Typography>

                <Typography variant="h6">
                  {selectedUser.team
                    ? selectedUser.team.teamName
                    : "Not Assigned"}
                </Typography>
              </Paper>
            </Box>
          )}
        </DialogContent>

        <DialogActions>
          <Button
            onClick={() => setOpen(false)}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default Users;