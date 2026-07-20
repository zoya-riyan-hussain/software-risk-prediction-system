import {
  Card,
  CardContent,
  Typography,
  Box,
} from "@mui/material";

function DashboardCard({
  title,
  value,
  color,
  icon,
  onClick,
}) {
  return (
    <Card
      onClick={onClick}
      sx={{
        cursor: "pointer",
        borderLeft: `5px solid ${color}`,
        borderRadius: 3,
        boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
        transition: "0.3s",

        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 8px 20px rgba(0,0,0,0.12)",
        },
      }}
    >
      <CardContent>
       <Box
         sx={{
           display: "flex",
           justifyContent: "space-between",
           alignItems: "center",
         }}
       >
          <Box>
            <Typography
              sx={{
                color: "#64748B",
                fontSize: 14,
                fontWeight: 600,
              }}
            >
              {title}
            </Typography>

            <Typography
              variant="h4"
              fontWeight="bold"
            >
              {value}
            </Typography>
          </Box>

          <Box
            sx={{
              width: 52,
              height: 52,
              borderRadius: 2,
              backgroundColor: `${color}20`,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontSize: 28,
            }}
          >
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

export default DashboardCard;