import { Box, Typography } from "@mui/material";
import React from "react";
import Moment from "react-moment";
import { Link } from "react-router-dom";
import { getMediaUrl } from "../helpers/mediaHelper";
import UserAvatar from "./UserAvatar";
import UserBadges from "./UserBadges";
import HorizontalStack from "./util/HorizontalStack";

const ContentDetails = ({ username, createdAt, edited, preview, space, circle, user }) => {
  const community = space || circle;
  const displayName = community?.name || username;
  const profilePath = space
    ? `/spaces/${space.slug}`
    : circle
    ? `/circles/${circle.slug}`
    : `/users/${username}`;
  const showcaseBadges = user?.showcaseBadges || user?.badges || [];

  return (
    <HorizontalStack spacing={1.25}>
      <Box
        component={Link}
        to={profilePath}
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
        {space ? (
          <Box
            component="img"
            src={getMediaUrl(space.avatarImage)}
            alt={space.name}
            sx={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              objectFit: "cover",
              backgroundColor: "grey.100",
            }}
          />
        ) : circle ? (
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "primary.main",
              color: "primary.contrastText",
              fontWeight: 900,
              fontSize: 14,
            }}
          >
            {circle.name?.charAt(0)?.toUpperCase()}
          </Box>
        ) : (
          <UserAvatar width={32} height={32} username={username} />
        )}
        <Typography
          variant="subtitle2"
          component="span"
          sx={{ fontWeight: 800, lineHeight: 1 }}
        >
          {displayName}
        </Typography>
        {!community && <UserBadges badges={showcaseBadges} size={18} />}
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
