import { Box, Typography } from "@mui/material";
import React from "react";
import Moment from "react-moment";
import { Link } from "react-router-dom";
import UserAvatar from "./UserAvatar";
import HorizontalStack from "./util/HorizontalStack";

const ContentDetails = ({ username, createdAt, edited, preview }) => {
  return (
    <HorizontalStack spacing={1.25}>
      <Box
        component={Link}
        to={"/users/" + username}
        onClick={(e) => {
          e.stopPropagation();
        }}
        sx={{
          display: "inline-flex",
          alignItems: "center",
          gap: 1,
          borderRadius: 999,
          py: 0.5,
          pr: 1.25,
          pl: 0.5,
          color: "text.primary",
          textDecoration: "none",
          backgroundColor: "grey.50",
          border: "1px solid",
          borderColor: "divider",
          transition:
            "background-color 160ms ease, border-color 160ms ease, color 160ms ease",
          "&:hover": {
            backgroundColor: "rgba(25, 118, 210, 0.08)",
            borderColor: "primary.light",
            color: "primary.main",
          },
        }}
      >
        <UserAvatar width={32} height={32} username={username} />
        <Typography
          variant="subtitle2"
          component="span"
          sx={{ fontWeight: 800, lineHeight: 1 }}
        >
          {username}
        </Typography>
      </Box>
      {!preview && (
        <Typography
          variant="caption"
          color="text.secondary"
          onClick={(e) => {
            e.stopPropagation();
          }}
          sx={{ whiteSpace: "nowrap", fontWeight: 600 }}
        >
          <Moment fromNow>{createdAt}</Moment>
          {edited && <> - Edited</>}
        </Typography>
      )}
    </HorizontalStack>
  );
};

export default ContentDetails;
