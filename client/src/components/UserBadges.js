import { Box, Tooltip } from "@mui/material";
import React from "react";
import { BADGE_MAP } from "../constants/badges";

const UserBadges = ({ badges = [], size = 20, locked, sx }) => {
  const visibleBadges = badges
    .map((key) => BADGE_MAP[key])
    .filter(Boolean)
    .slice(0, 3);

  if (!visibleBadges.length) return null;

  return (
    <Box sx={{ display: "inline-flex", alignItems: "center", gap: 0.35, ...sx }}>
      {visibleBadges.map((badge) => (
        <Tooltip title={badge.name} key={badge.key}>
          <Box
            component="img"
            src={badge.icon}
            alt={badge.name}
            sx={{
              width: size,
              height: size,
              opacity: locked ? 0.35 : 1,
              filter: locked ? "grayscale(1)" : "none",
            }}
          />
        </Tooltip>
      ))}
    </Box>
  );
};

export default UserBadges;
