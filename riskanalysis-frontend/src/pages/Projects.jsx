import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Stack,
  TextField,
  MenuItem,
  Tooltip,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip as RechartsTooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  LabelList,
} from "recharts";

import API from "../services/api";

function Projects() {
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  const [open, setOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  const loadProjects = async () => {
    try {
      const res = await API.get("/projects");
      setProjects(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleCreate = () => {
    navigate("/projects/new");
  };

  const handleEdit = (project) => {
    navigate(`/projects/edit/${project.id}`);
  };

  const totalProjects = projects.length;

  const activeProjects = projects.filter(
    (p) => p.status === "ACTIVE"
  ).length;

  const completedProjects = projects.filter(
    (p) => p.status === "COMPLETED"
  ).length;

  const planningProjects = projects.filter(
    (p) => p.status === "PLANNING"
  ).length;

  const statusData = [
    { name: "Active", value: activeProjects },
    { name: "Planning", value: planningProjects },
    { name: "Completed", value: completedProjects },
  ];

  const budgetData = projects.map((p) => ({
    name: p.name,
    budget: p.budget,
  }));

  const COLORS = [
    "#1976d2",
    "#ff9800",
    "#4caf50",
  ];

const formatBudget = (value) => {
  if (value >= 10000000) return `${(value / 10000000).toFixed(1)} Cr`;
  if (value >= 100000) return `${(value / 100000).toFixed(1)} L`;
  if (value >= 1000) return `${(value / 1000).toFixed(0)} K`;
  return value;
};

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
        <Typography
          variant="h4"
          fontWeight={700}
        >
          Project Management
        </Typography>

        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ mt: 0.5 }}
        >
          Create, monitor and manage all software projects
        </Typography>
      </Box>

      <Button
        variant="contained"
        size="large"
        onClick={handleCreate}
        sx={{
          borderRadius: 3,
          px: 4,
          py: 1.2,
          textTransform: "none",
          fontWeight: 600,
          boxShadow: 3,
        }}
      >
        + New Project
      </Button>
    </Box>

    <Box sx={{ mb: 6 }}>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2,1fr)",
            lg: "repeat(4,1fr)",
          },
          gap: 3,
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 3,
            borderRadius: 4,
          }}
        >
          <Typography color="text.secondary">
            Total Projects
          </Typography>

          <Typography
            variant="h3"
            fontWeight={700}
            mt={1}
          >
            {totalProjects}
          </Typography>
        </Paper>

        <Paper
          elevation={3}
          sx={{
            p: 3,
            borderRadius: 4,
          }}
        >
          <Typography color="text.secondary">
            Active
          </Typography>

          <Typography
            variant="h3"
            fontWeight={700}
            color="success.main"
            mt={1}
          >
            {activeProjects}
          </Typography>
        </Paper>

        <Paper
          elevation={3}
          sx={{
            p: 3,
            borderRadius: 4,
          }}
        >
          <Typography color="text.secondary">
            Completed
          </Typography>

          <Typography
            variant="h3"
            fontWeight={700}
            color="primary"
            mt={1}
          >
            {completedProjects}
          </Typography>
        </Paper>

        <Paper
          elevation={3}
          sx={{
            p: 3,
            borderRadius: 4,
          }}
        >
          <Typography color="text.secondary">
            Planning
          </Typography>

          <Typography
            variant="h3"
            fontWeight={700}
            color="warning.main"
            mt={1}
          >
            {planningProjects}
          </Typography>
        </Paper>
      </Box>
    </Box>

    <Box sx={{ mb: 6 }}>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            lg: "1fr 1fr",
          },
          gap: 4,
        }}
      >

        {/* Status Chart */}

        <Paper
          elevation={4}
          sx={{
            p: 4,
            borderRadius: 4,
            border: "1px solid #E2E8F0",
            minHeight: 430,
          }}
        >
          <Typography
            variant="h6"
            fontWeight={700}
            mb={3}
          >
            📊 Project Status Overview
          </Typography>

          <ResponsiveContainer
            width="100%"
            height={320}
          >
            <PieChart>

              <Pie
                data={statusData}
                dataKey="value"
                nameKey="name"
                outerRadius={120}
                innerRadius={60}
                paddingAngle={4}
                label
              >
                {statusData.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={COLORS[index]}
                  />
                ))}
              </Pie>

              <RechartsTooltip />

            </PieChart>
          </ResponsiveContainer>
        </Paper>

        {/* Budget Chart */}

        <Paper
          elevation={4}
          sx={{
            p: 4,
            borderRadius: 4,
            border: "1px solid #E2E8F0",
            minHeight: 430,
          }}
        >
          <Typography
            variant="h6"
            fontWeight={700}
            mb={3}
          >
            💰 Budget Distribution
          </Typography>

          <ResponsiveContainer
            width="100%"
            height={320}
          >
            <BarChart
              data={budgetData}
              margin={{
                top: 30,
                right: 20,
                left: 10,
                bottom: 60,
              }}
            >

              <XAxis
                dataKey="name"
                angle={-20}
                textAnchor="end"
                interval={0}
                tick={{
                  fontSize: 11,
                }}
                height={70}
              />

              <YAxis
                tickFormatter={formatBudget}
              />

              <RechartsTooltip
                formatter={(value) => [
                  `₹${Number(value).toLocaleString("en-IN")}`,
                  "Budget",
                ]}
              />

              <Bar
                dataKey="budget"
                fill="#2563EB"
                radius={[10, 10, 0, 0]}
              >
                <LabelList
                  dataKey="budget"
                  position="top"
                  formatter={formatBudget}
                />
              </Bar>

            </BarChart>
          </ResponsiveContainer>
        </Paper>

      </Box>
    </Box>

        <Paper
          elevation={3}
          sx={{
            p: 3,
            mb: 5,
            borderRadius: 4,
            border: "1px solid #E2E8F0",
          }}
        >
          <Typography
            variant="h6"
            fontWeight={700}
            mb={3}
          >
            🔍 Search & Filter Projects
          </Typography>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                md: "2fr 1fr 1fr",
              },
              gap: 3,
            }}
          >

            <TextField
              fullWidth
              label="Search Project"
              placeholder="Search by project name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <TextField
              select
              fullWidth
              label="Status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <MenuItem value="">All Projects</MenuItem>
              <MenuItem value="ACTIVE">Active</MenuItem>
              <MenuItem value="PLANNING">Planning</MenuItem>
              <MenuItem value="COMPLETED">Completed</MenuItem>
              <MenuItem value="ON_HOLD">On Hold</MenuItem>
            </TextField>

            <TextField
              select
              fullWidth
              label="Sort By"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <MenuItem value="newest">Newest</MenuItem>
              <MenuItem value="oldest">Oldest</MenuItem>
              <MenuItem value="budget">Highest Budget</MenuItem>
            </TextField>

          </Box>

          <Box
            sx={{
              mt: 3,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 2,
            }}
          >
            <Typography color="text.secondary">
              Showing{" "}
              <b>
                {
                  projects
                    .filter((project) =>
                      project.name
                        .toLowerCase()
                        .includes(search.toLowerCase())
                    )
                    .filter((project) =>
                      statusFilter
                        ? project.status === statusFilter
                        : true
                    ).length
                }
              </b>{" "}
              project(s)
            </Typography>

            <Button
              variant="outlined"
              onClick={() => {
                setSearch("");
                setStatusFilter("");
                setSortBy("newest");
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
        borderBottom: "1px solid #E2E8F0",
        bgcolor: "#F8FAFC",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Typography
        variant="h6"
        fontWeight={700}
      >
        📁 Projects List
      </Typography>

      <Typography color="text.secondary">
        {projects.length} Total Projects
      </Typography>
    </Box>

    <TableContainer
      sx={{
        maxHeight: 600,
      }}
    >
      <Table stickyHeader>

        <TableHead>

          <TableRow>

            <TableCell sx={{ fontWeight: 700 }}>
              ID
            </TableCell>

            <TableCell sx={{ fontWeight: 700 }}>
              Project
            </TableCell>

            <TableCell sx={{ fontWeight: 700 }}>
              Manager
            </TableCell>

            <TableCell sx={{ fontWeight: 700 }}>
              Status
            </TableCell>

            <TableCell sx={{ fontWeight: 700 }}>
              Budget
            </TableCell>

            <TableCell
              align="center"
              sx={{ fontWeight: 700 }}
            >
              Actions
            </TableCell>

          </TableRow>

        </TableHead>

        <TableBody>

          {projects
            .filter((project) =>
              project.name
                .toLowerCase()
                .includes(search.toLowerCase())
            )
            .filter((project) =>
              statusFilter
                ? project.status === statusFilter
                : true
            )
            .sort((a, b) => {

              if (sortBy === "budget")
                return b.budget - a.budget;

              if (sortBy === "oldest")
                return a.id - b.id;

              return b.id - a.id;

            })
            .map((project) => (

              <TableRow
                hover
                key={project.id}
                sx={{
                  "&:hover": {
                    bgcolor: "#F8FAFC",
                  },
                }}
              >

                <TableCell>
                  #{project.id}
                </TableCell>

                <TableCell>

                  <Typography fontWeight={700}>
                    {project.name}
                  </Typography>

                  <Typography
                    variant="caption"
                    color="text.secondary"
                  >
                    Software Project
                  </Typography>

                </TableCell>

                <TableCell>

                  {project.manager?.name || "-"}

                </TableCell>

                <TableCell>

                  <Chip
                    label={project.status}
                    color={
                      project.status === "ACTIVE"
                        ? "success"
                        : project.status === "COMPLETED"
                        ? "primary"
                        : project.status === "PLANNING"
                        ? "warning"
                        : "default"
                    }
                    sx={{
                      fontWeight: 600,
                      minWidth: 100,
                    }}
                  />

                </TableCell>

                <TableCell>

                  <Typography fontWeight={700}>
                    ₹ {Number(project.budget || 0).toLocaleString("en-IN")}
                  </Typography>

                </TableCell>

                <TableCell align="center">

                  <Tooltip title="View">

                    <IconButton
                      color="info"
                      onClick={() => {
                        setSelectedProject(project);
                        setOpen(true);
                      }}
                    >
                      <VisibilityIcon />
                    </IconButton>

                  </Tooltip>

                  <Tooltip title="Edit">

                    <IconButton
                      color="warning"
                      onClick={() => handleEdit(project)}
                    >
                      <EditIcon />
                    </IconButton>

                  </Tooltip>

                  <Tooltip title="Delete">

                    <IconButton
                      color="error"
                      onClick={async () => {

                        if (
                          window.confirm(
                            "Delete this project?"
                          )
                        ) {
                          try {
                            await API.delete(`/projects/${project.id}`);
                            loadProjects();
                          } catch (err) {
                            console.error(err);
                          }

                          loadProjects();
                        }

                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>

            ))}

          {projects.filter((project) =>
            project.name
              .toLowerCase()
              .includes(search.toLowerCase())
          ).length === 0 && (

            <TableRow>

              <TableCell
                colSpan={6}
                align="center"
                sx={{
                  py: 8,
                }}
              >

                <Typography
                  variant="h6"
                  color="text.secondary"
                >
                  No Projects Found
                </Typography>

                <Typography
                  color="text.secondary"
                >
                  Try changing the search or filters.
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
         maxWidth="md"
         fullWidth
         PaperProps={{
           sx: {
             borderRadius: 4,
             overflow: "hidden",
           },
         }}
       >
         <DialogTitle
           sx={{
             bgcolor: "#2563EB",
             color: "white",
             fontWeight: 700,
             fontSize: "1.4rem",
             py: 2.5,
           }}
         >
           📁 Project Details
         </DialogTitle>

         <DialogContent
           sx={{
             p: 4,
             bgcolor: "#F8FAFC",
           }}
         >
           {selectedProject && (
             <Box
               sx={{
                 display: "grid",
                 gridTemplateColumns: {
                   xs: "1fr",
                   md: "1fr 1fr",
                 },
                 gap: 3,
               }}
             >

               <Paper
                 elevation={1}
                 sx={{
                   p: 3,
                   borderRadius: 3,
                 }}
               >
                 <Typography color="text.secondary">
                   Project Name
                 </Typography>

                 <Typography
                   variant="h6"
                   fontWeight={700}
                   mt={1}
                 >
                   {selectedProject.name}
                 </Typography>
               </Paper>

               <Paper
                 elevation={1}
                 sx={{
                   p: 3,
                   borderRadius: 3,
                 }}
               >
                 <Typography color="text.secondary">
                   Project Manager
                 </Typography>

                 <Typography
                   variant="h6"
                   fontWeight={700}
                   mt={1}
                 >
                   {selectedProject.manager?.name || "-"}
                 </Typography>
               </Paper>

               <Paper
                 elevation={1}
                 sx={{
                   p: 3,
                   borderRadius: 3,
                 }}
               >
                 <Typography color="text.secondary">
                   Status
                 </Typography>

                 <Chip
                   sx={{ mt: 1 }}
                   label={selectedProject.status}
                   color={
                     selectedProject.status === "ACTIVE"
                       ? "success"
                       : selectedProject.status === "COMPLETED"
                       ? "primary"
                       : selectedProject.status === "PLANNING"
                       ? "warning"
                       : "default"
                   }
                 />
               </Paper>

               <Paper
                 elevation={1}
                 sx={{
                   p: 3,
                   borderRadius: 3,
                 }}
               >
                 <Typography color="text.secondary">
                   Budget
                 </Typography>

                 <Typography
                   variant="h6"
                   fontWeight={700}
                   mt={1}
                 >
                   ₹ {Number(selectedProject.budget || 0).toLocaleString("en-IN")}
                 </Typography>
               </Paper>

               <Paper
                 elevation={1}
                 sx={{
                   p: 3,
                   borderRadius: 3,
                 }}
               >
                 <Typography color="text.secondary">
                   Start Date
                 </Typography>

                 <Typography mt={1}>
                   {selectedProject.startDate
                     ? new Date(
                         selectedProject.startDate
                       ).toLocaleDateString()
                     : "-"}
                 </Typography>
               </Paper>

               <Paper
                 elevation={1}
                 sx={{
                   p: 3,
                   borderRadius: 3,
                 }}
               >
                 <Typography color="text.secondary">
                   End Date
                 </Typography>

                 <Typography mt={1}>
                   {selectedProject.endDate
                     ? new Date(
                         selectedProject.endDate
                       ).toLocaleDateString()
                     : "-"}
                 </Typography>
               </Paper>

               <Paper
                 elevation={1}
                 sx={{
                   p: 3,
                   borderRadius: 3,
                   gridColumn: {
                     xs: "1",
                     md: "1 / 3",
                   },
                 }}
               >
                 <Typography color="text.secondary">
                   Description
                 </Typography>

                 <Typography
                   sx={{
                     mt: 2,
                     lineHeight: 1.8,
                   }}
                 >
                   {selectedProject.description ||
                     "No description available."}
                 </Typography>
               </Paper>

             </Box>
           )}
         </DialogContent>

         <DialogActions
           sx={{
             px: 4,
             py: 2,
             bgcolor: "#F8FAFC",
           }}
         >
           <Button
             variant="outlined"
             onClick={() => setOpen(false)}
           >
             Close
           </Button>

           <Button
             variant="contained"
             onClick={() => {
               setOpen(false);
               handleEdit(selectedProject);
             }}
           >
             Edit Project
           </Button>
         </DialogActions>
       </Dialog>

        {/* <ProjectDialog
          open={openDialog}
          handleClose={() => setOpenDialog(false)}
          refreshProjects={loadProjects}
          project={selectedProject}
        /> */}
      </>
    );
  }

  export default Projects;
