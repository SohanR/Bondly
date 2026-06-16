import {
  Box,
  Card,
  Divider,
  List,
  ListItemButton,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { MdAutoGraph } from "react-icons/md";
import { Link } from "react-router-dom";
import { getPosts } from "../api/posts";
import { isLoggedIn } from "../helpers/authHelper";
import Loading from "./Loading";
import HorizontalStack from "./util/HorizontalStack";

const TopPosts = ({ space, circle, title = "Top Posts" }) => {
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState(null);
  const user = isLoggedIn();
  const token = user && user.token;

  useEffect(() => {
    const fetchPosts = async () => {
      const query = { sortBy: circle ? "-helpfulCount" : space ? "-voteScore" : "-likeCount" };
      if (space) query.space = space;
      if (circle) query.circle = circle;
      const data = await getPosts(token, query);
      const topPosts = [];

      if (data && data.data) {
        for (let i = 0; i < 3 && i < data.data.length; i++) {
          topPosts.push(data.data[i]);
        }
      }

      setPosts(topPosts);
      setLoading(false);
    };

    fetchPosts();
  }, [token, space, circle]);

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
            <MdAutoGraph />
          </Box>
          <Box>
            <Typography sx={{ fontWeight: 800, lineHeight: 1.1 }}>
              {title}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {circle ? "Most helpful discussions" : space ? "Top posts here" : "Most liked right now"}
            </Typography>
          </Box>
        </HorizontalStack>

        {!loading ? (
          posts && posts.length > 0 ? (
            <List disablePadding>
              {posts.map((post, index) => (
                <React.Fragment key={post._id}>
                  {index > 0 && <Divider component="li" />}
                  <ListItemButton
                    component={Link}
                    to={`/posts/${post._id}`}
                    sx={{
                      alignItems: "flex-start",
                      borderRadius: 2,
                      px: 1,
                      py: 1.25,
                      textDecoration: "none",
                      "&:hover": {
                        backgroundColor: "rgba(25, 118, 210, 0.08)",
                      },
                    }}
                  >
                    <ListItemText
                      primary={post.title}
                      secondary={`@${post.poster?.username || "unknown"} - ${
                        circle
                          ? `${post.helpfulCount || 0} helpful`
                          : space
                          ? `${post.voteScore || 0} score`
                          : `${post.likeCount || 0} ${post.likeCount === 1 ? "like" : "likes"}`
                      }`}
                      primaryTypographyProps={{
                        fontWeight: 900,
                        color: "text.primary",
                        lineHeight: 1.25,
                      }}
                      secondaryTypographyProps={{
                        color: "text.secondary",
                        fontWeight: 700,
                        mt: 0.5,
                      }}
                    />
                  </ListItemButton>
                </React.Fragment>
              ))}
            </List>
          ) : (
            <Typography variant="body2" color="text.secondary">
              No top posts yet
            </Typography>
          )
        ) : (
          <Loading />
        )}
      </Stack>
    </Card>
  );
};

export default TopPosts;
