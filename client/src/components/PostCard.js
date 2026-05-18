import {
  Button,
  Card,
  Chip,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import React, { useState } from "react";
import { AiOutlineComment } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import { deletePost, likePost, unlikePost, updatePost } from "../api/posts";
import { isLoggedIn } from "../helpers/authHelper";
import ContentDetails from "./ContentDetails";

import LikeBox from "./LikeBox";
import PostContentBox from "./PostContentBox";
import HorizontalStack from "./util/HorizontalStack";

import ContentUpdateEditor from "./ContentUpdateEditor";
import Markdown from "./Markdown";

import "./postCard.css";
import {
  MdCheck,
  MdClose,
  MdDeleteOutline,
  MdModeEditOutline,
} from "react-icons/md";
import UserLikePreview from "./UserLikePreview";

const PostCard = (props) => {
  const { preview, removePost } = props;
  let postData = props.post;
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const user = isLoggedIn();
  const isAuthor = user && user?.username === postData?.poster?.username;

  const [editing, setEditing] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [post, setPost] = useState(postData);
  const [likeCount, setLikeCount] = useState(post.likeCount);

  let maxHeight = null;
  if (preview === "primary") {
    maxHeight = 250;
  }

  const handleDeletePost = async (e) => {
    e.stopPropagation();

    if (!confirm) {
      setConfirm(true);
    } else {
      setLoading(true);
      await deletePost(post._id, isLoggedIn());
      setLoading(false);
      if (preview) {
        removePost(post);
      } else {
        navigate("/");
      }
    }
  };

  const handleEditPost = async (e) => {
    e.stopPropagation();

    setEditing(!editing);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const content = e.target.content.value;
    await updatePost(post._id, isLoggedIn(), { content });
    setPost({ ...post, content, edited: true });
    setEditing(false);
  };

  const handleLike = async (liked) => {
    if (liked) {
      setLikeCount(likeCount + 1);
      setPost({
        ...post,
        liked: true,
        userLikePreview: [
          { _id: user.userId, username: user.username },
          ...(post.userLikePreview || []).filter(
            (likeUser) => likeUser._id !== user.userId
          ),
        ],
      });
      await likePost(post._id, user);
    } else {
      setLikeCount(likeCount - 1);
      setPost({
        ...post,
        liked: false,
        userLikePreview: (post.userLikePreview || []).filter(
          (likeUser) => likeUser._id !== user.userId
        ),
      });
      await unlikePost(post._id, user);
    }
  };

  const handleCommentClick = (e) => {
    e.stopPropagation();
    navigate("/posts/" + post._id);
  };

  return (
    <Card sx={{ padding: 0 }} className="post-card">
      <Box className={preview}>
        <PostContentBox clickable={preview} post={post} editing={editing}>
          <Stack spacing={2}>
            <HorizontalStack justifyContent="space-between">
              <ContentDetails
                username={post.poster?.username}
                createdAt={post.createdAt}
                edited={post.edited}
                preview={preview === "secondary"}
              />
              <Box>
                {user &&
                  (isAuthor || user.isAdmin) &&
                  preview !== "secondary" && (
                    <HorizontalStack>
                      <IconButton
                        disabled={loading}
                        size="small"
                        onClick={handleEditPost}
                        sx={{
                          width: 36,
                          height: 36,
                          borderRadius: "50%",
                          color: editing ? "warning.main" : "text.secondary",
                          backgroundColor: editing
                            ? "rgba(237, 108, 2, 0.08)"
                            : "grey.50",
                          border: "1px solid",
                          borderColor: editing ? "warning.light" : "divider",
                          "&:hover": {
                            backgroundColor: editing
                              ? "rgba(237, 108, 2, 0.14)"
                              : "rgba(25, 118, 210, 0.08)",
                            color: editing ? "warning.dark" : "primary.main",
                            borderColor: editing ? "warning.main" : "primary.light",
                          },
                        }}
                      >
                        {editing ? <MdClose /> : <MdModeEditOutline />}
                      </IconButton>
                      <IconButton
                        disabled={loading}
                        size="small"
                        onClick={handleDeletePost}
                        sx={{
                          width: 36,
                          height: 36,
                          borderRadius: "50%",
                          color: confirm ? "error.main" : "text.secondary",
                          backgroundColor: confirm
                            ? "rgba(211, 47, 47, 0.08)"
                            : "grey.50",
                          border: "1px solid",
                          borderColor: confirm ? "error.light" : "divider",
                          "&:hover": {
                            backgroundColor: "rgba(211, 47, 47, 0.1)",
                            color: "error.main",
                            borderColor: "error.light",
                          },
                        }}
                      >
                        {confirm ? <MdCheck /> : <MdDeleteOutline />}
                      </IconButton>
                    </HorizontalStack>
                )}
              </Box>
            </HorizontalStack>

            <Typography
              variant="h5"
              gutterBottom
              sx={{ overflow: "hidden", mt: 1, maxHeight: 125 }}
              className="title"
            >
              {post.title}
            </Typography>

            {post.tags && post.tags.length > 0 && (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75 }}>
                {post.tags.map((tag) => (
                  <Chip
                    key={tag._id || tag.name}
                    component={Link}
                    to={`/?tag=${encodeURIComponent(tag.name)}`}
                    clickable
                    size="small"
                    label={`#${tag.name}`}
                    onClick={(e) => e.stopPropagation()}
                    sx={{
                      borderRadius: 999,
                      fontWeight: 800,
                      textDecoration: "none",
                      backgroundColor: "grey.50",
                      border: "1px solid",
                      borderColor: "divider",
                      "&:hover": {
                        backgroundColor: "rgba(25, 118, 210, 0.08)",
                        borderColor: "primary.light",
                      },
                    }}
                  />
                ))}
              </Box>
            )}

            {preview !== "secondary" &&
              (editing ? (
                <ContentUpdateEditor
                  handleSubmit={handleSubmit}
                  originalContent={post.content}
                />
              ) : (
                <Box
                  maxHeight={maxHeight}
                  overflow="hidden"
                  className="content"
                >
                  <Markdown content={post.content} />
                </Box>
              ))}

            <Stack
              direction={{ xs: "column", sm: "row" }}
              alignItems={{ xs: "stretch", sm: "center" }}
              justifyContent="space-between"
              spacing={1.5}
              className="post-card-actions"
            >
              <HorizontalStack spacing={1}>
                <LikeBox
                  likeCount={likeCount}
                  liked={post.liked}
                  onLike={handleLike}
                />
                <Button
                  onClick={handleCommentClick}
                  variant="outlined"
                  size="small"
                  startIcon={<AiOutlineComment />}
                  sx={{
                    borderRadius: 999,
                    px: 1.75,
                    py: 0.75,
                    textTransform: "none",
                    fontWeight: 700,
                    color: "text.primary",
                    borderColor: "divider",
                  }}
                >
                  {post.commentCount}
                </Button>
              </HorizontalStack>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: { xs: "flex-start", sm: "flex-end" },
                }}
              >
                <UserLikePreview
                  postId={post._id}
                  userLikePreview={post.userLikePreview}
                  compact={preview === "secondary"}
                />
              </Box>
            </Stack>
          </Stack>
        </PostContentBox>
      </Box>
    </Card>
  );
};

export default PostCard;
