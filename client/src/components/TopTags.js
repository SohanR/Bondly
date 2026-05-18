import {
  Box,
  Card,
  List,
  ListItemButton,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { MdTag } from "react-icons/md";
import { Link } from "react-router-dom";
import { getTopTags } from "../api/tags";
import Loading from "./Loading";
import HorizontalStack from "./util/HorizontalStack";

const TopTags = () => {
  const [loading, setLoading] = useState(true);
  const [tags, setTags] = useState([]);

  const fetchTags = async () => {
    const data = await getTopTags({ limit: 12 });
    setTags(Array.isArray(data?.data) ? data.data : []);
    setLoading(false);
  };

  useEffect(() => {
    fetchTags();
  }, []);

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
            <MdTag />
          </Box>
          <Box>
            <Typography sx={{ fontWeight: 800, lineHeight: 1.1 }}>
              Top Tags
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Browse posts by topic
            </Typography>
          </Box>
        </HorizontalStack>

        {loading ? (
          <Loading />
        ) : tags.length > 0 ? (
          <List disablePadding>
            {tags.map((tag) => (
              <ListItemButton
                key={tag._id}
                component={Link}
                to={`/?tag=${encodeURIComponent(tag.name)}`}
                sx={{
                  borderRadius: 2,
                  px: 1.25,
                  py: 0.85,
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
                <ListItemText
                  primary={`#${tag.name}`}
                  secondary={`${tag.postCount} ${
                    tag.postCount === 1 ? "post" : "posts"
                  }`}
                  primaryTypographyProps={{
                    fontWeight: 900,
                    color: "text.primary",
                    noWrap: true,
                  }}
                  secondaryTypographyProps={{
                    color: "text.secondary",
                    fontWeight: 700,
                  }}
                />
              </ListItemButton>
            ))}
          </List>
        ) : (
          <Typography variant="body2" color="text.secondary">
            No tags yet
          </Typography>
        )}
      </Stack>
    </Card>
  );
};

export default TopTags;
