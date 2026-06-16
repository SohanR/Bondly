import { Button } from "@mui/material";
import React, { useState } from "react";
import { MdOutlineVolunteerActivism } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { helpfulCirclePost, unhelpfulCirclePost } from "../api/circles";
import { isLoggedIn } from "../helpers/authHelper";

const HelpfulBox = ({ post }) => {
  const navigate = useNavigate();
  const user = isLoggedIn();
  const [helpful, setHelpful] = useState(Boolean(post.viewerHelpful));
  const [helpfulCount, setHelpfulCount] = useState(post.helpfulCount || 0);
  const [loading, setLoading] = useState(false);

  const handleClick = async (e) => {
    e.stopPropagation();

    if (!user) {
      navigate("/login");
      return;
    }

    setLoading(true);
    const data = helpful
      ? await unhelpfulCirclePost(user, post._id)
      : await helpfulCirclePost(user, post._id);
    setLoading(false);

    if (data && !data.error) {
      setHelpful(Boolean(data.viewerHelpful));
      setHelpfulCount(data.helpfulCount || 0);
    }
  };

  return (
    <Button
      variant={helpful ? "contained" : "outlined"}
      size="small"
      startIcon={<MdOutlineVolunteerActivism />}
      onClick={handleClick}
      disabled={loading}
      sx={{
        borderRadius: 999,
        px: 1.75,
        py: 0.75,
        textTransform: "none",
        fontWeight: 800,
      }}
    >
      {helpfulCount} Helpful
    </Button>
  );
};

export default HelpfulBox;
