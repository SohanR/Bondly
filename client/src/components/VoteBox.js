import { Button, Stack, Typography } from "@mui/material";
import React, { useState } from "react";
import { MdArrowDownward, MdArrowUpward, MdVisibility } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { unvotePost, votePost } from "../api/posts";
import { isLoggedIn } from "../helpers/authHelper";
import HorizontalStack from "./util/HorizontalStack";

const VoteBox = ({ post, onChange }) => {
  const [viewerVote, setViewerVote] = useState(post.viewerVote || null);
  const [voteScore, setVoteScore] = useState(post.voteScore || 0);
  const [impressionCount, setImpressionCount] = useState(post.impressionCount || 0);
  const navigate = useNavigate();

  const handleVote = async (value) => {
    const user = isLoggedIn();
    if (!user) {
      navigate("/login");
      return;
    }

    let data;
    if (viewerVote === value) {
      data = await unvotePost(post._id, user);
    } else {
      data = await votePost(post._id, user, value);
    }

    if (data && !data.error) {
      setViewerVote(data.viewerVote);
      setVoteScore(data.voteScore);
      setImpressionCount(data.impressionCount);
      onChange && onChange(data);
    }
  };

  return (
    <HorizontalStack spacing={1}>
      <Stack direction="row" spacing={0.5}>
        <Button
          onClick={(e) => {
            e.stopPropagation();
            handleVote(1);
          }}
          variant={viewerVote === 1 ? "contained" : "outlined"}
          size="small"
          sx={{ borderRadius: 999, minWidth: 0, px: 1.25 }}
        >
          <MdArrowUpward />
        </Button>
        <Button
          onClick={(e) => {
            e.stopPropagation();
            handleVote(-1);
          }}
          variant={viewerVote === -1 ? "contained" : "outlined"}
          color={viewerVote === -1 ? "error" : "primary"}
          size="small"
          sx={{ borderRadius: 999, minWidth: 0, px: 1.25 }}
        >
          <MdArrowDownward />
        </Button>
      </Stack>
      <Typography variant="body2" sx={{ fontWeight: 800 }}>
        {voteScore} votes
      </Typography>
      <HorizontalStack spacing={0.5}>
        <MdVisibility />
        <Typography variant="body2" sx={{ fontWeight: 700 }}>
          {impressionCount}
        </Typography>
      </HorizontalStack>
    </HorizontalStack>
  );
};

export default VoteBox;
