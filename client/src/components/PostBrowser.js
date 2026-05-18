import { Button, Card, Stack, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect, useState } from "react";
import { MdFavoriteBorder, MdViewStream } from "react-icons/md";
import { useSearchParams } from "react-router-dom";
import { getPosts, getUserLikedPosts } from "../api/posts";
import { isLoggedIn } from "../helpers/authHelper";
import CreatePost from "./CreatePost";
import Loading from "./Loading";
import PostCard from "./PostCard";
import SortBySelect from "./SortBySelect";

const PostBrowser = (props) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [end, setEnd] = useState(false);
  const [sortBy, setSortBy] = useState("-createdAt");
  const [count, setCount] = useState(0);
  const user = isLoggedIn();

  const [search] = useSearchParams();
  const [effect, setEffect] = useState(false);

  const searchExists =
    search && search.get("search") && search.get("search").length > 0;
  const tagExists = search && search.get("tag") && search.get("tag").length > 0;

  const fetchPosts = async () => {
    setLoading(true);
    const newPage = page + 1;
    setPage(newPage);

    let query = {
      page: newPage,
      sortBy,
    };

    let data;

    if (props.contentType === "posts") {
      if (props.profileUser) query.author = props.profileUser.username;
      if (searchExists) query.search = search.get("search");
      if (tagExists) query.tag = search.get("tag");

      data = await getPosts(user && user.token, query);
    } else if (props.contentType === "liked") {
      data = await getUserLikedPosts(
        props.profileUser._id,
        user && user.token,
        query
      );
    }

    const responsePosts = Array.isArray(data?.data) ? data.data : [];

    if (!data || data.error || !Array.isArray(data.data)) {
      setLoading(false);
      setEnd(true);
      setPosts([]);
      setCount(0);
      return;
    }

    if (responsePosts.length < 10) {
      setEnd(true);
    }

    setLoading(false);
    setPosts([...posts, ...responsePosts]);
    setCount(data.count || responsePosts.length);
  };

  useEffect(() => {
    fetchPosts();
  }, [sortBy, effect]);

  useEffect(() => {
    setPosts([]);
    setPage(0);
    setEnd(false);
    setEffect(!effect);
  }, [search]);

  const handleSortBy = (e) => {
    const newSortName = e.target.value;
    let newSortBy;

    Object.keys(sorts).forEach((sortName) => {
      if (sorts[sortName] === newSortName) newSortBy = sortName;
    });

    setPosts([]);
    setPage(0);
    setEnd(false);
    setSortBy(newSortBy);
  };

  const removePost = (removedPost) => {
    setPosts(posts.filter((post) => post._id !== removedPost._id));
  };

  const handleBackToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const contentTypeSorts = {
    posts: {
      "-createdAt": "Latest",
      "-likeCount": "Likes",
      "-commentCount": "Comments",
      createdAt: "Earliest",
    },
    liked: {
      "-createdAt": "Latest",
      createdAt: "Earliest",
    },
  };

  const sorts = contentTypeSorts[props.contentType];
  const isLikedTab = props.contentType === "liked";

  return (
    <>
      <Stack spacing={2}>
        <Card
          sx={{
            borderRadius: 3,
            p: { xs: 1.5, sm: 2 },
            background:
              "linear-gradient(135deg, rgba(25, 118, 210, 0.06), rgba(15, 23, 42, 0.02))",
          }}
        >
          <Stack
            direction={{ xs: "column", sm: "row" }}
            alignItems={{ xs: "stretch", sm: "center" }}
            justifyContent={props.createPost ? "space-between" : "flex-end"}
            spacing={1.5}
          >
            {props.createPost && <CreatePost />}
            <SortBySelect
              onSortBy={handleSortBy}
              sortBy={sortBy}
              sorts={sorts}
            />
          </Stack>
        </Card>

        {searchExists && (
          <Box>
            <Typography variant="h5" gutterBottom>
              Showing results for "{search.get("search")}"
            </Typography>
            <Typography color="text.secondary" variant="span">
              {count} results found
            </Typography>
          </Box>
        )}

        {tagExists && (
          <Box>
            <Typography variant="h5" gutterBottom>
              Posts tagged #{search.get("tag")}
            </Typography>
            <Typography color="text.secondary" variant="span">
              {count} results found
            </Typography>
          </Box>
        )}

        {posts.map((post, i) => (
          <PostCard
            preview="primary"
            key={post._id}
            post={post}
            removePost={removePost}
          />
        ))}

        {loading && <Loading />}
        {end ? (
          <Card sx={{ borderRadius: 3, p: 3 }}>
            <Stack alignItems="center" textAlign="center" spacing={1}>
              <Box
                sx={{
                  width: 44,
                  height: 44,
                  borderRadius: "50%",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: isLikedTab ? "error.main" : "primary.main",
                  backgroundColor: isLikedTab
                    ? "rgba(211, 47, 47, 0.08)"
                    : "rgba(25, 118, 210, 0.08)",
                  fontSize: 22,
                }}
              >
                {isLikedTab ? <MdFavoriteBorder /> : <MdViewStream />}
              </Box>
              <Typography sx={{ fontWeight: 800 }}>
                {posts.length > 0
                  ? isLikedTab
                    ? "All liked posts have been viewed"
                    : "All posts have been viewed"
                  : isLikedTab
                  ? "No liked posts available"
                  : "No posts available"}
              </Typography>
              <Button variant="text" size="small" onClick={handleBackToTop}>
                Back to top
              </Button>
            </Stack>
          </Card>
        ) : (
          !loading &&
          posts &&
          posts.length > 0 && (
            <Stack pt={2} pb={6} alignItems="center" spacing={2}>
              <Button onClick={fetchPosts} variant="contained">
                Load more
              </Button>
              <Button variant="text" size="small" onClick={handleBackToTop}>
                Back to top
              </Button>
            </Stack>
          )
        )}
      </Stack>
    </>
  );
};

export default PostBrowser;
