import {
  Avatar,
  Box,
  Button,
  Card,
  Divider,
  List,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material";
import React from "react";
import { MdAdd, MdGroups } from "react-icons/md";
import { Link } from "react-router-dom";
import { getMediaUrl } from "../helpers/mediaHelper";
import { isLoggedIn } from "../helpers/authHelper";

const UserSpaces = ({ profile }) => {
  const currentUser = isLoggedIn();
  const isOwner = currentUser && profile?.user?._id === currentUser.userId;
  const spaces = Array.isArray(profile?.spaces) ? profile.spaces : [];
  const circles = Array.isArray(profile?.circles) ? profile.circles : [];
  const canCreateSpace = Boolean(profile?.badges?.canCreateSpace);

  if (!isOwner && spaces.length === 0 && circles.length === 0) return null;

  return (
    <Card sx={{ borderRadius: 3, p: 2 }}>
      <Stack spacing={2}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography sx={{ fontWeight: 900 }}>Communities</Typography>
          {isOwner && (
            <Stack direction="row" spacing={1}>
              <Button
                component={canCreateSpace ? Link : "button"}
                to={canCreateSpace ? "/spaces/create" : undefined}
                size="small"
                startIcon={<MdAdd />}
                variant="contained"
                disabled={!canCreateSpace}
                sx={{ borderRadius: 999, fontWeight: 800 }}
              >
                Space
              </Button>
              <Button
                component={canCreateSpace ? Link : "button"}
                to={canCreateSpace ? "/circles/create" : undefined}
                size="small"
                startIcon={<MdGroups />}
                variant="outlined"
                disabled={!canCreateSpace}
                sx={{ borderRadius: 999, fontWeight: 800 }}
              >
                Circle
              </Button>
            </Stack>
          )}
        </Stack>
        <Typography variant="caption" color="text.secondary">
          Space and Circle creation require Verified User, Developer, and one more badge.
        </Typography>

        <Box>
          <Typography variant="subtitle2" sx={{ fontWeight: 900, mb: 0.5 }}>
            Spaces
          </Typography>
          {spaces.length > 0 ? (
            <List disablePadding>
              {spaces.map((space) => (
                <ListItemButton
                  key={space._id}
                  component={Link}
                  to={`/spaces/${space.slug}`}
                  sx={{ borderRadius: 2, px: 1 }}
                >
                  <ListItemAvatar sx={{ minWidth: 42 }}>
                    <Avatar src={getMediaUrl(space.avatarImage)} />
                  </ListItemAvatar>
                  <ListItemText
                    primary={space.name}
                    secondary={space.published ? space.specialization : "Unpublished"}
                    primaryTypographyProps={{ fontWeight: 900 }}
                  />
                </ListItemButton>
              ))}
            </List>
          ) : (
            <Typography variant="body2" color="text.secondary">
              No spaces created yet
            </Typography>
          )}
        </Box>

        <Divider />

        <Box>
          <Typography variant="subtitle2" sx={{ fontWeight: 900, mb: 0.5 }}>
            Circles
          </Typography>
          {circles.length > 0 ? (
            <List disablePadding>
              {circles.map((circle) => (
                <ListItemButton
                  key={circle._id}
                  component={Link}
                  to={`/circles/${circle.slug}`}
                  sx={{ borderRadius: 2, px: 1 }}
                >
                  <ListItemAvatar sx={{ minWidth: 42 }}>
                    <Avatar sx={{ fontWeight: 900 }}>
                      {circle.name?.charAt(0)?.toUpperCase()}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={circle.name}
                    secondary={`${circle.stack || "Circle"} · ${
                      circle.memberCount || 0
                    } members`}
                    primaryTypographyProps={{ fontWeight: 900 }}
                  />
                </ListItemButton>
              ))}
            </List>
          ) : (
            <Typography variant="body2" color="text.secondary">
              No circles created yet
            </Typography>
          )}
        </Box>
      </Stack>
    </Card>
  );
};

export default UserSpaces;
