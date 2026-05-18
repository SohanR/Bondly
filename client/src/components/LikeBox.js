import { Button, Typography, useTheme } from "@mui/material";
import React, { useState } from "react";
import { AiFillLike, AiOutlineLike } from "react-icons/ai";
import { IconContext } from "react-icons/lib";
import { useNavigate } from "react-router-dom";
import { isLoggedIn } from "../helpers/authHelper";

const LikeBox = (props) => {
  const { likeCount, onLike } = props;
  const theme = useTheme();
  const [liked, setLiked] = useState(props.liked);

  const navigate = useNavigate();

  const handleLike = (e) => {
    e.stopPropagation();

    if (isLoggedIn()) {
      const newLikedValue = !liked;
      setLiked(newLikedValue);
      onLike(newLikedValue);
    } else {
      navigate("/login");
    }
  };

  return (
    <Button
      onClick={handleLike}
      variant={liked ? "contained" : "outlined"}
      size="small"
      sx={{
        borderRadius: 999,
        px: 1.75,
        py: 0.75,
        minWidth: 0,
        textTransform: "none",
        boxShadow: liked ? "0 6px 16px rgba(25, 118, 210, 0.22)" : "none",
        gap: 0.75,
      }}
    >
      <Typography
        component="span"
        sx={{
          display: "inline-flex",
          color: liked ? "primary.contrastText" : "text.secondary",
          fontSize: 18,
        }}
      >
        {liked ? (
          <IconContext.Provider
            value={{ color: theme.palette.primary.contrastText }}
          >
            <AiFillLike />
          </IconContext.Provider>
        ) : (
          <AiOutlineLike />
        )}
      </Typography>
      <Typography
        component="span"
        variant="body2"
        sx={{ fontWeight: 700, color: liked ? "primary.contrastText" : "text.primary" }}
      >
        {likeCount}
      </Typography>
    </Button>
  );
};

export default LikeBox;
