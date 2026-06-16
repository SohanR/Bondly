import {
  Avatar,
  Box,
  Card,
  List,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { MdExplore } from "react-icons/md";
import { Link } from "react-router-dom";
import { getTopSpaces, searchSpaces } from "../api/spaces";
import { getMediaUrl } from "../helpers/mediaHelper";
import Loading from "./Loading";
import HorizontalStack from "./util/HorizontalStack";

const TopSpaces = () => {
  const [loading, setLoading] = useState(true);
  const [spaces, setSpaces] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchSpaces = async () => {
      setLoading(true);
      const data = search.trim()
        ? await searchSpaces({ search, limit: 8 })
        : await getTopSpaces({ limit: 8 });

      setSpaces(Array.isArray(data?.data) ? data.data : []);
      setLoading(false);
    };

    const timer = setTimeout(fetchSpaces, 250);
    return () => clearTimeout(timer);
  }, [search]);

  return (
    <Card
      sx={{
        borderRadius: 3,
        p: 2,
        background:
          "linear-gradient(135deg, rgba(25, 118, 210, 0.08), rgba(15, 23, 42, 0.02))",
      }}
    >
      <Stack spacing={1.5}>
        <HorizontalStack spacing={1.5}>
          <Box
            sx={{
              width: 38,
              height: 38,
              borderRadius: "50%",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              color: "primary.main",
              backgroundColor: "background.paper",
              border: "1px solid",
              borderColor: "divider",
              boxShadow: "0 8px 22px rgba(25, 118, 210, 0.14)",
              fontSize: 22,
            }}
          >
            <MdExplore />
          </Box>
          <Box>
            <Typography sx={{ fontWeight: 800, lineHeight: 1.1 }}>
              Top Spaces
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Developer communities
            </Typography>
          </Box>
        </HorizontalStack>

        <TextField
          size="small"
          placeholder="Search spaces"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
              backgroundColor: "background.paper",
            },
          }}
        />

        {loading ? (
          <Loading />
        ) : spaces.length > 0 ? (
          <List disablePadding>
            {spaces.map((space) => (
              <ListItemButton
                key={space._id}
                component={Link}
                to={`/spaces/${space.slug}`}
                sx={{
                  borderRadius: 2,
                  px: 1,
                  py: 1,
                  mb: 0.5,
                  textDecoration: "none",
                  backgroundColor: "background.paper",
                  border: "1px solid",
                  borderColor: "divider",
                  "&:hover": {
                    backgroundColor: "rgba(25, 118, 210, 0.08)",
                    borderColor: "primary.light",
                  },
                }}
              >
                <ListItemAvatar sx={{ minWidth: 42 }}>
                  <Avatar src={getMediaUrl(space.avatarImage)} />
                </ListItemAvatar>
                <ListItemText
                  primary={space.name}
                  secondary={`${space.followerCount || 0} followers`}
                  primaryTypographyProps={{ fontWeight: 900, noWrap: true }}
                  secondaryTypographyProps={{ fontWeight: 700 }}
                />
              </ListItemButton>
            ))}
          </List>
        ) : (
          <Typography variant="body2" color="text.secondary">
            No spaces found
          </Typography>
        )}
      </Stack>
    </Card>
  );
};

export default TopSpaces;
