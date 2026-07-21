import { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  IconButton,
  InputAdornment,
  Divider,
} from "@mui/material";

import {
  Visibility,
  VisibilityOff,
  Security,
  Assessment,
  Analytics,
  Groups,
} from "@mui/icons-material";

import API from "../services/api";

const login = async () => {
  setLoading(true);

  try {
    const res = await API.post("/auth/login", form);

    localStorage.setItem("token", res.data.token);
    localStorage.setItem("name", res.data.name);
    localStorage.setItem("email", res.data.email);
    localStorage.setItem("role", res.data.role);

    window.location.replace("/");

  } catch (error) {

      console.log("========== LOGIN ERROR ==========");
      console.log(error);

      if (error.response) {
        console.log("Status:", error.response.status);
        console.log("Data:", error.response.data);

        alert(error.response.data.message || JSON.stringify(error.response.data));

      } else if (error.request) {

        console.log("No response received");
        alert("Cannot connect to server.");

      } else {

        console.log("Request Error:", error.message);
        alert(error.message);

      }

    }finally {
    setLoading(false);
  }
};

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        bgcolor: "#EEF4FB",
      }}
    >
      {/* LEFT PANEL */}

      <Box
        sx={{
          width: "50%",
          background:
            "linear-gradient(135deg,#1565C0,#0D47A1,#0B3C91)",
          color: "white",
          display: {
            xs: "none",
            md: "flex",
          },
          flexDirection: "column",
          justifyContent: "center",
          p: 8,
        }}
      >
        <Security sx={{ fontSize: 70 }} />

        <Typography
          variant="h3"
          fontWeight="bold"
          mt={2}
        >
          AI Risk Analysis
        </Typography>

        <Typography
          sx={{
            mt: 2,
            fontSize: 18,
            opacity: .9,
            lineHeight: 1.8,
            maxWidth: 500,
          }}
        >
          Intelligent Software Project Risk Prediction &
          Analysis Platform powered by Artificial Intelligence
          for modern project management.
        </Typography>

        <Paper
          sx={{
            mt: 6,
            p: 3,
            borderRadius: 4,
          }}
        >
          <Box display="flex" alignItems="center" mb={2}>
            <Assessment color="primary" />
            <Typography ml={2} fontWeight="bold">
              AI Risk Prediction
            </Typography>
          </Box>

          <Box display="flex" alignItems="center" mb={2}>
            <Analytics color="primary" />
            <Typography ml={2} fontWeight="bold">
              Real-Time Dashboard
            </Typography>
          </Box>

          <Box display="flex" alignItems="center">
            <Groups color="primary" />
            <Typography ml={2} fontWeight="bold">
              Team Collaboration
            </Typography>
          </Box>
        </Paper>
      </Box>

      {/* RIGHT PANEL */}

      <Box
        sx={{
          width: {
            xs: "100%",
            md: "50%",
          },
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          p: 4,
        }}
      >
        <Paper
          elevation={8}
          sx={{
            width: 450,
            p: 5,
            borderRadius: 5,
          }}
        >
          <Box textAlign="center">

            <Security
              sx={{
                fontSize: 60,
                color: "#1565C0",
              }}
            />

            <Typography
              variant="h4"
              fontWeight="bold"
              mt={2}
            >
              Welcome Back
            </Typography>

            <Typography color="text.secondary">
              Sign in to continue
            </Typography>

          </Box>

          <Divider sx={{ my: 4 }} />

          <TextField
            fullWidth
            label="Email Address"
            name="email"
            value={form.email}
            onChange={handleChange}
            sx={{ mb: 3 }}
          />

          <TextField
            fullWidth
            label="Password"
            name="password"
            type={showPassword ? "text" : "password"}
            value={form.password}
            onChange={handleChange}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() =>
                      setShowPassword(!showPassword)
                    }
                  >
                    {showPassword ? (
                      <VisibilityOff />
                    ) : (
                      <Visibility />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{ mb: 2 }}
          />

          <Box
            display="flex"
            justifyContent="flex-start"
            alignItems="center"
            mb={3}
          >
            <FormControlLabel
              control={<Checkbox />}
              label="Remember Me"
            />
          </Box>

          <Button
            fullWidth
            variant="contained"
            size="large"
            onClick={login}
            disabled={loading}
            sx={{
              py: 1.6,
              borderRadius: 3,
              fontSize: 16,
              fontWeight: "bold",
              textTransform: "none",
            }}
          >
            {loading ? "Signing In..." : "Sign In"}
          </Button>

          <Typography
            align="center"
            color="text.secondary"
            mt={4}
            fontSize={13}
          >
            © 2026 AI Project Risk Analysis System
          </Typography>

        </Paper>
      </Box>
    </Box>
  );
}

export default Login;