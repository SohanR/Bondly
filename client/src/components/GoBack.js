import { Button } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";
import { MdArrowBack } from "react-icons/md";

const GoBack = () => {
  return (
    <Button
      component={Link}
      to="/"
      startIcon={<MdArrowBack />}
      sx={{
        mb: 2,
        borderRadius: 999,
        px: 1.5,
        py: 0.75,
        textTransform: "none",
        fontWeight: 800,
        color: "text.primary",
        backgroundColor: "background.paper",
        border: "1px solid",
        borderColor: "divider",
        "&:hover": {
          color: "primary.main",
          backgroundColor: "rgba(25, 118, 210, 0.08)",
          borderColor: "primary.light",
        },
      }}
    >
      Back to posts
    </Button>
  );
};

export default GoBack;
