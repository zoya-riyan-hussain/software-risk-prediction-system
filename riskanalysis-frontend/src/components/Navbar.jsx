import { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Avatar,
  Badge,
  Menu,
  MenuItem,
  Divider,
} from "@mui/material";

import NotificationsIcon from "@mui/icons-material/Notifications";
import LogoutIcon from "@mui/icons-material/Logout";

function Navbar() {
  const hour = new Date().getHours();

  let greeting = "Good Evening";

  if (hour < 12) greeting = "Good Morning";
  else if (hour < 17) greeting = "Good Afternoon";

  const name = localStorage.getItem("name") || "User";
  const role = localStorage.getItem("role") || "User";

  const [anchorEl, setAnchorEl] = useState(null);

  const open = Boolean(anchorEl);

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const logout = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          bgcolor: "#fff",
          color: "#0F172A",
          borderBottom: "1px solid #E2E8F0",
        }}
      >
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            minHeight: "72px",
          }}
        >
          <Box>
            <Typography variant="h5" fontWeight="700">
              {greeting}
            </Typography>

            <Typography
              variant="body2"
              sx={{ color: "#64748B" }}
            >
              Welcome to Software Project Risk Prediction and Analysis System
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
            }}
          >
            {/* Role Badge */}
            <Box
              sx={{
                px: 3,
                py: 0.8,
                border: "1.5px solid #7C3AED",
                borderRadius: "999px",
                color: "#7C3AED",
                fontWeight: "700",
                fontSize: "14px",
                background: "#fff",
              }}
            >
              {role}
            </Box>

            {/* Notification */}
            <Badge badgeContent={3} color="error">
              <NotificationsIcon
                sx={{
                  fontSize: 28,
                  cursor: "pointer",
                  color: "#374151",
                }}
              />
            </Badge>

            {/* Profile */}
            <Box
              onClick={handleOpen}
              sx={{
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
                bgcolor: "#F3F4F6",
                borderRadius: "999px",
                px: 1,
                py: 0.5,
                gap: 1.5,
                "&:hover": {
                  bgcolor: "#E5E7EB",
                },
              }}
            >
              <Avatar
                sx={{
                  bgcolor: "#3B82F6",
                  width: 42,
                  height: 42,
                  fontWeight: "bold",
                }}
              >
                {name.charAt(0).toUpperCase()}
              </Avatar>

              <Box sx={{ mr: 1 }}>
                <Typography
                  sx={{
                    fontWeight: 700,
                    fontSize: 16,
                    lineHeight: 1.2,
                  }}
                >
                  {name.toUpperCase()}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Toolbar>
      </AppBar>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: {
            width: 280,
            mt: 1,
            borderRadius: 2,
            boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
          },
        }}
      >
        <Box sx={{ p: 2 }}>
          <Typography color="text.secondary" fontSize={14}>
            Signed in as
          </Typography>

          <Typography fontWeight="bold" fontSize={20}>
            {name.toUpperCase()}
          </Typography>

          <Typography color="text.secondary">
            {role}
          </Typography>
        </Box>

        <Divider />

        <MenuItem
          onClick={logout}
          sx={{
            color: "#DC2626",
            fontWeight: 600,
            py: 1.5,
          }}
        >
          <LogoutIcon sx={{ mr: 2 }} />
          Logout
        </MenuItem>
      </Menu>
    </>
  );
}

export default Navbar;