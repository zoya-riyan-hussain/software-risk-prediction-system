import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CircularProgress from "@mui/material/CircularProgress";
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
  TextField,
  MenuItem,
  Tooltip,
  IconButton,
} from "@mui/material";
import API from "../services/api";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from "@mui/material";

function Risks() {
  const navigate = useNavigate();

  const [risks, setRisks] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedRisk, setSelectedRisk] = useState(null);
  const [open, setOpen] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState("");
  const [aiLoading, setAiLoading] = useState(false);

  const loadRisks = async () => {
    try {
      const response = await API.get("/risks");
      setRisks(response.data);
    } catch (error) {
      console.error(error);
    }
  };

const exportPDF = () => {
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text("Software Project Risk Report", 14, 20);

  autoTable(doc, {
    startY: 30,
    head: [[
      "ID",
      "Title",
      "Project",
      "Category",
      "Level",
      "Status",
      "Probability",
      "Impact",
      "Score"
    ]],
    body: risks.map((risk) => [
      risk.id,
      risk.title,
      risk.project?.name || "",
      risk.category,
      risk.level,
      risk.status,
      risk.probability,
      risk.impact,
      risk.score,
    ]),
  });

  doc.save("Risk_Report.pdf");
};

  useEffect(() => {
    loadRisks();
  }, []);

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
          Risk Management
        </Typography>

        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ mt: 0.5 }}
        >
          Monitor, assess and mitigate project risks
        </Typography>
      </Box>

      <Box
        sx={{
          display: "flex",
          gap: 2,
          flexWrap: "wrap",
        }}
      >
        <Button
          variant="outlined"
          color="success"
          onClick={exportPDF}
        >
          Export PDF
        </Button>

        <Button
          variant="contained"
          onClick={() => navigate("/risks/new")}
        >
          + New Risk
        </Button>
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
          🔍 Search & Filter Risks
        </Typography>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              md: "repeat(3,1fr)",
            },
            gap: 3,
          }}
        >
          <TextField
            label="Search Risk"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            fullWidth
          />

          <TextField
            select
            label="Status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            fullWidth
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="OPEN">Open</MenuItem>
            <MenuItem value="MITIGATED">Mitigated</MenuItem>
            <MenuItem value="CLOSED">Closed</MenuItem>
          </TextField>

          <TextField
            select
            label="Category"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            fullWidth
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="TECHNICAL">Technical</MenuItem>
            <MenuItem value="SCHEDULE">Schedule</MenuItem>
            <MenuItem value="BUDGET">Budget</MenuItem>
            <MenuItem value="RESOURCE">Resource</MenuItem>
            <MenuItem value="SECURITY">Security</MenuItem>
            <MenuItem value="QUALITY">Quality</MenuItem>
            <MenuItem value="REQUIREMENT">Requirement</MenuItem>
            <MenuItem value="COMMUNICATION">Communication</MenuItem>
          </TextField>
        </Box>

        <Box
          sx={{
            mt: 3,
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Typography color="text.secondary">
            Showing{" "}
            <b>
              {
                risks
                  .filter((risk) =>
                    risk.title.toLowerCase().includes(search.toLowerCase())
                  )
                  .filter((risk) =>
                    statusFilter ? risk.status === statusFilter : true
                  )
                  .filter((risk) =>
                    categoryFilter ? risk.category === categoryFilter : true
                  ).length
              }
            </b>{" "}
            risk(s)
          </Typography>

          <Button
            variant="outlined"
            onClick={() => {
              setSearch("");
              setStatusFilter("");
              setCategoryFilter("");
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
          <Typography variant="h6" fontWeight={700}>
            ⚠️ Risks List
          </Typography>

          <Typography color="text.secondary">
            {risks.length} Total Risks
          </Typography>
        </Box>

        <TableContainer sx={{ maxHeight: 650 }}>
          <Table stickyHeader>

            <TableHead>

              <TableRow>

                <TableCell><b>ID</b></TableCell>
                <TableCell><b>Title</b></TableCell>
                <TableCell><b>Project</b></TableCell>
                <TableCell><b>Category</b></TableCell>
                <TableCell><b>Probability</b></TableCell>
                <TableCell><b>Impact</b></TableCell>
                <TableCell><b>Score</b></TableCell>
                <TableCell><b>Level</b></TableCell>
                <TableCell><b>Status</b></TableCell>
                <TableCell align="center"><b>Actions</b></TableCell>

              </TableRow>

            </TableHead>

            <TableBody>

              {risks
                .filter((risk) =>
                  risk.title.toLowerCase().includes(search.toLowerCase())
                )
                .filter((risk) =>
                  statusFilter ? risk.status === statusFilter : true
                )
                .filter((risk) =>
                  categoryFilter ? risk.category === categoryFilter : true
                )
                .map((risk) => (

                  <TableRow
                    key={risk.id}
                    hover
                    sx={{
                      "&:hover": {
                        bgcolor: "#F8FAFC",
                      },
                    }}
                  >

                    <TableCell>#{risk.id}</TableCell>

                    <TableCell>
                      <Typography fontWeight={700}>
                        {risk.title}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      {risk.project?.name || "-"}
                    </TableCell>

                    <TableCell>{risk.category}</TableCell>

                    <TableCell>{risk.probability}</TableCell>

                    <TableCell>{risk.impact}</TableCell>

                    <TableCell>
                      <Typography fontWeight={700}>
                        {risk.score}
                      </Typography>
                    </TableCell>

                    <TableCell>

                      <Chip
                        label={risk.level}
                        sx={{
                          fontWeight: 700,
                          minWidth: 95,
                          bgcolor:
                            risk.level === "CRITICAL"
                              ? "#FEE2E2"
                              : risk.level === "HIGH"
                              ? "#FEF3C7"
                              : risk.level === "MEDIUM"
                              ? "#DBEAFE"
                              : "#D1FAE5",

                          color:
                            risk.level === "CRITICAL"
                              ? "#DC2626"
                              : risk.level === "HIGH"
                              ? "#D97706"
                              : risk.level === "MEDIUM"
                              ? "#2563EB"
                              : "#059669",
                        }}
                      />

                    </TableCell>

                    <TableCell>

                      <Chip
                        label={risk.status}
                        color={
                          risk.status === "OPEN"
                            ? "error"
                            : risk.status === "MITIGATED"
                            ? "warning"
                            : "success"
                        }
                      />

                    </TableCell>

                    <TableCell align="center">

                      <Tooltip title="View">

                        <IconButton
                          color="info"
                          onClick={() => {
                            setSelectedRisk(risk);
                            setOpen(true);
                          }}
                        >
                          <VisibilityIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit">
                        <IconButton
                          color="warning"
                          onClick={() =>
                            navigate(`/risks/edit/${risk.id}`)
                          }
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                     <Tooltip title="AI Analysis">
                       <IconButton
                         color="success"
                         onClick={async () => {

                           setOpen(true);

                           setSelectedRisk({
                             ...risk,
                             aiSuggestion: "",
                           });

                           setAiLoading(true);

                           try {

                             const res = await API.get(`/ai/mitigation/${risk.id}`);

                             setSelectedRisk({
                               ...risk,
                               aiSuggestion: res.data,
                             });

                           } catch {

                             setSelectedRisk({
                               ...risk,
                               aiSuggestion: "Unable to generate AI suggestion.",
                             });

                           } finally {

                             setAiLoading(false);

                           }

                         }}
                       >
                         {aiLoading && selectedRisk?.id === risk.id ? (
                           <CircularProgress size={22} color="inherit" />
                         ) : (
                           "🤖"
                         )}
                       </IconButton>
                     </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton
                          color="error"
                          onClick={async () => {
                            if (window.confirm("Delete this risk?")) {
                              await API.delete(`/risks/${risk.id}`);
                              loadRisks();
                            }
                          }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Dialog
        open={open}
        onClose={() => {
          setOpen(false);
          setAiLoading(false);
          setSelectedRisk(null);
        }}
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
          ⚠️ Risk Details
        </DialogTitle>

        <DialogContent
          sx={{
            p: 4,
            bgcolor: "#F8FAFC",
          }}
        >
          {selectedRisk && (
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
                sx={{ p: 3, borderRadius: 3 }}
              >
                <Typography color="text.secondary">
                  Risk Title
                </Typography>

                <Typography
                  variant="h6"
                  fontWeight={700}
                  mt={1}
                >
                  {selectedRisk.title}
                </Typography>
              </Paper>

              <Paper
                elevation={1}
                sx={{ p: 3, borderRadius: 3 }}
              >
                <Typography color="text.secondary">
                  Project
                </Typography>

                <Typography
                  variant="h6"
                  fontWeight={700}
                  mt={1}
                >
                  {selectedRisk.project?.name || "-"}
                </Typography>
              </Paper>

              <Paper
                elevation={1}
                sx={{ p: 3, borderRadius: 3 }}
              >
                <Typography color="text.secondary">
                  Category
                </Typography>

                <Typography mt={1}>
                  {selectedRisk.category}
                </Typography>
              </Paper>

              <Paper
                elevation={1}
                sx={{ p: 3, borderRadius: 3 }}
              >
                <Typography color="text.secondary">
                  Risk Score
                </Typography>

                <Typography
                  variant="h5"
                  fontWeight={700}
                  mt={1}
                >
                  {selectedRisk.score}
                </Typography>
              </Paper>

              <Paper
                elevation={1}
                sx={{ p: 3, borderRadius: 3 }}
              >
                <Typography color="text.secondary">
                  Probability
                </Typography>

                <Typography mt={1}>
                  {selectedRisk.probability}
                </Typography>
              </Paper>

              <Paper
                elevation={1}
                sx={{ p: 3, borderRadius: 3 }}
              >
                <Typography color="text.secondary">
                  Impact
                </Typography>

                <Typography mt={1}>
                  {selectedRisk.impact}
                </Typography>
              </Paper>

              <Paper
                elevation={1}
                sx={{ p: 3, borderRadius: 3 }}
              >
                <Typography color="text.secondary">
                  Level
                </Typography>

                <Chip
                  sx={{ mt: 1 }}
                  label={selectedRisk.level}
                  color={
                    selectedRisk.level === "CRITICAL"
                      ? "error"
                      : selectedRisk.level === "HIGH"
                      ? "warning"
                      : selectedRisk.level === "MEDIUM"
                      ? "info"
                      : "success"
                  }
                />
              </Paper>

              <Paper
                elevation={1}
                sx={{ p: 3, borderRadius: 3 }}
              >
                <Typography color="text.secondary">
                  Status
                </Typography>

                <Chip
                  sx={{ mt: 1 }}
                  label={selectedRisk.status}
                  color={
                    selectedRisk.status === "OPEN"
                      ? "error"
                      : selectedRisk.status === "MITIGATED"
                      ? "warning"
                      : "success"
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
                  Identified Date
                </Typography>

                <Typography mt={1}>
                  {selectedRisk.identifiedDate || "-"}
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
                  Due Date
                </Typography>

                <Typography mt={1}>
                  {selectedRisk.dueDate || "-"}
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
                  mt={2}
                  sx={{ lineHeight: 1.8 }}
                >
                  {selectedRisk.description || "No description available."}
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
                  Mitigation Plan
                </Typography>

                <Typography
                  mt={2}
                  sx={{ lineHeight: 1.8 }}
                >
                  {selectedRisk.mitigationPlan || "No mitigation plan available."}
                </Typography>
              </Paper>

              {aiLoading ? (

                <Paper
                  elevation={1}
                  sx={{
                    p: 3,
                    borderRadius: 3,
                    textAlign: "center",
                    gridColumn: {
                      xs: "1",
                      md: "1 / 3",
                    },
                  }}
                >
                  <CircularProgress />

                  <Typography mt={2}>
                    Generating AI Risk Analysis...
                  </Typography>

                </Paper>

              ) : selectedRisk.aiSuggestion ? (

                <Paper
                  elevation={1}
                  sx={{
                    p: 3,
                    borderRadius: 3,
                    bgcolor: "#EEF7FF",
                    borderLeft: "5px solid #1976d2",
                    gridColumn: {
                      xs: "1",
                      md: "1 / 3",
                    },
                  }}
                >
                  <Typography
                    variant="h6"
                    fontWeight="bold"
                    mb={2}
                  >
                    🤖 AI Risk Analysis
                  </Typography>

                  <Typography
                    sx={{
                      whiteSpace: "pre-wrap",
                      lineHeight: 1.8,
                    }}
                  >
                    {selectedRisk.aiSuggestion}
                  </Typography>

                </Paper>

              ) : null}
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
            onClick={() => {
              setOpen(false);
              setAiLoading(false);
              setSelectedRisk(null);
            }}
          >
            Close
          </Button>

          <Button
            variant="contained"
            onClick={() => {
              setOpen(false);
              selectedRisk && navigate(`/risks/edit/${selectedRisk.id}`);
            }}
          >
            Edit Risk
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default Risks;