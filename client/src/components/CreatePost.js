import { Button } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
import { MdTipsAndUpdates } from "react-icons/md";

const CreatePost = () => {
  const navigate = useNavigate();
  return (
    <Button
      variant="contained"
      size="medium"
      startIcon={<MdTipsAndUpdates />}
      onClick={() => navigate("/posts/create")}
      sx={{
        borderRadius: 999,
        px: 2,
        py: 1,
        whiteSpace: "nowrap",
        textTransform: "none",
        fontWeight: 800,
        boxShadow: "0 10px 24px rgba(25, 118, 210, 0.2)",
        "&:hover": {
          boxShadow: "0 12px 28px rgba(25, 118, 210, 0.28)",
        },
      }}
    >
      Share your thought
    </Button>
  );
};

export default CreatePost;
