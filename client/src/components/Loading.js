import { Box, Stack, Typography } from "@mui/material";
import React from "react";
import devSpaceLogo from "../assets/devspace-logo.png";

const Loading = ({ label }) => {
  return (
    <Stack alignItems="center" spacing={1.25} sx={{ py: 2 }}>
      <Box
        sx={{
          width: 68,
          height: 68,
          borderRadius: "50%",
          display: "grid",
          placeItems: "center",
          background:
            "radial-gradient(circle at 35% 25%, rgba(25, 118, 210, 0.16), rgba(25, 118, 210, 0.04))",
          border: "1px solid",
          borderColor: "divider",
          animation: "devSpacePulse 1.8s ease-in-out infinite",
          "@keyframes devSpacePulse": {
            "0%, 100%": {
              transform: "translateY(0)",
              boxShadow: "0 10px 28px rgba(15, 23, 42, 0.08)",
            },
            "50%": {
              transform: "translateY(-3px)",
              boxShadow: "0 16px 36px rgba(25, 118, 210, 0.18)",
            },
          },
        }}
      >
        <Box
          component="img"
          src={devSpaceLogo}
          alt=""
          sx={{ width: 46, height: 46, objectFit: "contain" }}
        />
      </Box>
      <Typography color="text.secondary" sx={{ mb: 1, fontWeight: 700 }}>
        {label || "Thinking"}
      </Typography>
    </Stack>
  );
};

export default Loading;
