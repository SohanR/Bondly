import { Avatar, AvatarGroup, Box, Button, Typography } from "@mui/material";
import React, { useState } from "react";
import { AiFillLike } from "react-icons/ai";
import UserLikeModal from "./UserLikeModal";

const UserLikePreview = ({ postId, userLikePreview, compact }) => {
  const [open, setOpen] = useState(false);

  const handleClick = (event) => {
    event.stopPropagation();
    setOpen(true);
  };

  let userLikes;
  if (userLikePreview) {
    userLikes = userLikePreview.slice(0, compact ? 2 : 3);
  }

  return (
    userLikes && (
      <>
        <Button
          variant="text"
          size="small"
          startIcon={<AiFillLike />}
          color="primary"
          onClick={handleClick}
          sx={{
            borderRadius: 999,
            px: compact ? 0.75 : 1.25,
            py: compact ? 0.25 : 0.5,
            minWidth: 0,
            textTransform: "none",
            color: "text.secondary",
            "&:hover": {
              backgroundColor: "action.hover",
              color: "primary.main",
            },
            ".MuiButton-startIcon": {
              mr: compact ? 0.25 : 0.75,
              display: compact ? "none" : "inherit",
            },
          }}
        >
          <AvatarGroup
            max={compact ? 2 : 3}
            sx={{
              mr: compact ? 0 : 1,
              ".MuiAvatar-root": {
                width: compact ? 26 : 28,
                height: compact ? 26 : 28,
                border: "2px solid white",
                fontSize: compact ? 11 : 12,
                fontWeight: 800,
              },
            }}
          >
            {userLikes &&
              userLikes.map((userLike) => (
                <Avatar
                  src={`https://robohash.org/${userLike.username}`}
                  sx={{ backgroundColor: "grey.200" }}
                  key={userLike._id}
                />
              ))}
          </AvatarGroup>
          {compact ? (
            userLikePreview.length > 2 && (
              <Box
                component="span"
                sx={{
                  ml: 0.5,
                  px: 0.75,
                  height: 24,
                  minWidth: 24,
                  borderRadius: 999,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "grey.100",
                  color: "text.secondary",
                  fontSize: 12,
                  fontWeight: 800,
                }}
              >
                +{userLikePreview.length - 2}
              </Box>
            )
          ) : (
            <Typography
              component="span"
              variant="body2"
              sx={{ fontWeight: 700 }}
            >
              Liked by {userLikes[0]?.username}
              {userLikePreview.length > 1 &&
                ` and ${userLikePreview.length - 1} other${
                  userLikePreview.length - 1 > 1 ? "s" : ""
                }`}
            </Typography>
          )}
        </Button>
        {open && (
          <UserLikeModal open={open} setOpen={setOpen} postId={postId} />
        )}
      </>
    )
  );
};

export default UserLikePreview;
