import {
  Box,
  Card,
  List,
  ListItemButton,
  ListItemText,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { MdGroups } from "react-icons/md";
import { Link } from "react-router-dom";
import { getTopCircles, searchCircles } from "../api/circles";
import Loading from "./Loading";
import HorizontalStack from "./util/HorizontalStack";

const TopCircles = () => {
  const [loading, setLoading] = useState(true);
  const [circles, setCircles] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchCircles = async () => {
      setLoading(true);
      const data = search.trim()
        ? await searchCircles({ search, limit: 8 })
        : await getTopCircles({ limit: 8 });

      setCircles(Array.isArray(data?.data) ? data.data : []);
      setLoading(false);
    };

    const timer = setTimeout(fetchCircles, 250);
    return () => clearTimeout(timer);
  }, [search]);

  return (
    <Card sx={{ borderRadius: 3, p: 2 }}>
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
              fontSize: 22,
            }}
          >
            <MdGroups />
          </Box>
          <Box>
            <Typography sx={{ fontWeight: 800, lineHeight: 1.1 }}>Top Circles</Typography>
            <Typography variant="caption" color="text.secondary">
              Discussion communities
            </Typography>
          </Box>
        </HorizontalStack>

        <TextField
          size="small"
          placeholder="Search circles or stack"
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
        ) : circles.length > 0 ? (
          <List disablePadding>
            {circles.map((circle) => (
              <ListItemButton
                key={circle._id}
                component={Link}
                to={`/circles/${circle.slug}`}
                sx={{
                  borderRadius: 2,
                  px: 1,
                  py: 1,
                  mb: 0.5,
                  textDecoration: "none",
                  backgroundColor: "background.paper",
                  border: "1px solid",
                  borderColor: "divider",
                }}
              >
                <ListItemText
                  primary={circle.name}
                  secondary={`${circle.memberCount || 0} members · ${circle.stack}`}
                  primaryTypographyProps={{ fontWeight: 900, noWrap: true }}
                  secondaryTypographyProps={{ fontWeight: 700 }}
                />
              </ListItemButton>
            ))}
          </List>
        ) : (
          <Typography variant="body2" color="text.secondary">
            No circles found
          </Typography>
        )}
      </Stack>
    </Card>
  );
};

export default TopCircles;
