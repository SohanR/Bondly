import { Box, Button, Card, Stack, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { MdChatBubbleOutline } from "react-icons/md";
import { getUserComments } from "../api/posts";
import Comment from "./Comment";
import Loading from "./Loading";
import SortBySelect from "./SortBySelect";

const CommentBrowser = (props) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [sortBy, setSortBy] = useState("-createdAt");

  const fetchComments = async () => {
    setLoading(true);

    const newPage = page + 1;
    setPage(newPage);

    const data = await getUserComments({
      id: props.profileUser._id,
      query: { sortBy },
    });

    setComments(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  useEffect(() => {
    fetchComments();
  }, [sortBy]);

  const handleSortBy = (e) => {
    const newSortName = e.target.value;
    let newSortBy;

    Object.keys(sorts).forEach((sortName) => {
      if (sorts[sortName] === newSortName) newSortBy = sortName;
    });

    setComments([]);
    setPage(0);
    setSortBy(newSortBy);
  };

  const handleBackToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const sorts = {
    "-createdAt": "Latest",
    createdAt: "Earliest",
  };

  return (
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
          justifyContent="space-between"
          alignItems={{ xs: "stretch", sm: "center" }}
          spacing={1.5}
        >
          <Box>
            <Typography sx={{ fontWeight: 900 }}>Comment activity</Typography>
            <Typography variant="body2" color="text.secondary">
              Replies and thoughts shared by this user
            </Typography>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <SortBySelect onSortBy={handleSortBy} sortBy={sortBy} sorts={sorts} />
          </Box>
        </Stack>
      </Card>
      {loading ? (
        <Loading />
      ) : (
        <>
          <Stack spacing={1.5}>
            {comments.map((comment) => (
              <Comment key={comment._id} comment={comment} profile />
            ))}
          </Stack>

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
                  color: "primary.main",
                  backgroundColor: "rgba(25, 118, 210, 0.08)",
                  fontSize: 22,
                }}
              >
                <MdChatBubbleOutline />
              </Box>
              <Typography sx={{ fontWeight: 800 }}>
                {comments.length > 0
                  ? "All comments have been viewed"
                  : "No comments available"}
              </Typography>
              <Button variant="text" size="small" onClick={handleBackToTop}>
                Back to top
              </Button>
            </Stack>
          </Card>
        </>
      )}
    </Stack>
  );
};

export default CommentBrowser;
