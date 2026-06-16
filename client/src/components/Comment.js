import { Box, Button, IconButton, Stack, Typography } from "@mui/material";
import React, { useState } from "react";
import {
  MdAdd,
  MdCheck,
  MdClose,
  MdDeleteOutline,
  MdModeEditOutline,
  MdRemove,
  MdReply,
} from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import { deleteComment, updateComment } from "../api/posts";
import { isLoggedIn } from "../helpers/authHelper";
import CommentEditor from "./CommentEditor";
import ContentDetails from "./ContentDetails";
import ContentUpdateEditor from "./ContentUpdateEditor";
import Markdown from "./Markdown";
import HorizontalStack from "./util/HorizontalStack";
import Moment from "react-moment";

const CommentIconButton = ({ children, tone = "primary", sx, ...props }) => {
  const colorMap = {
    primary: "primary.main",
    error: "error.main",
    neutral: "text.secondary",
  };

  return (
    <IconButton
      size="small"
      sx={{
        width: 34,
        height: 34,
        borderRadius: "50%",
        color: colorMap[tone],
        backgroundColor: "background.paper",
        border: "1px solid",
        borderColor: "divider",
        "&:hover": {
          backgroundColor:
            tone === "error"
              ? "rgba(211, 47, 47, 0.08)"
              : "rgba(25, 118, 210, 0.08)",
          borderColor: tone === "error" ? "error.light" : "primary.light",
        },
        ...sx,
      }}
      {...props}
    >
      {children}
    </IconButton>
  );
};

const Comment = (props) => {
  const { depth, addComment, removeComment, editComment } = props;
  const commentData = props.comment;
  const [minimised, setMinimised] = useState(depth % 4 === 3);
  const [replying, setReplying] = useState(false);
  const [editing, setEditing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [comment, setComment] = useState(commentData);
  const user = isLoggedIn();
  const isAuthor = user && user.userId === comment.commenter._id;
  const navigate = useNavigate();
  const childCount = comment.children ? comment.children.length : 0;

  const handleSetReplying = () => {
    if (isLoggedIn()) {
      setReplying(!replying);
    } else {
      navigate("/login");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const content = e.target.content.value;

    await updateComment(comment._id, user, { content });

    const newCommentData = { ...comment, content, edited: true };

    setComment(newCommentData);
    editComment(newCommentData);
    setEditing(false);
  };

  const handleDelete = async () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }

    await deleteComment(comment._id, user);
    removeComment(comment);
  };

  return (
    <Box
      sx={{
        position: "relative",
        ml: depth > 0 ? { xs: 1.25, sm: 2 } : 0,
        pl: depth > 0 ? { xs: 1.25, sm: 2 } : 0,
        borderLeft: depth > 0 ? "2px solid" : 0,
        borderColor: "divider",
      }}
    >
      <Box
        sx={{
          borderRadius: 3,
          mb: 1.5,
          p: { xs: 1.5, sm: 2 },
          backgroundColor: depth % 2 === 0 ? "background.paper" : "grey.50",
          border: "1px solid",
          borderColor: "divider",
          boxShadow:
            depth === 0 ? "0 10px 28px rgba(15, 23, 42, 0.06)" : "none",
        }}
      >
        {props.profile ? (
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800 }}>
              <Link to={"/posts/" + comment.post._id}>
                {comment.post.title}
              </Link>
            </Typography>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              <Moment fromNow>{comment.createdAt}</Moment>{" "}
              {comment.edited && <>(Edited)</>}
            </Typography>
          </Box>
        ) : (
          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
            alignItems={{ xs: "flex-start", sm: "center" }}
            spacing={1}
          >
            <HorizontalStack>
              <ContentDetails
                username={comment.commenter.username}
                user={comment.commenter}
                createdAt={comment.createdAt}
                edited={comment.edited}
              />

              <CommentIconButton
                tone="neutral"
                onClick={() => setMinimised(!minimised)}
              >
                {minimised ? <MdAdd /> : <MdRemove />}
              </CommentIconButton>
            </HorizontalStack>
            {!minimised && (
              <HorizontalStack spacing={1}>
                <Button
                  variant={replying ? "contained" : "outlined"}
                  size="small"
                  startIcon={replying ? <MdClose /> : <MdReply />}
                  onClick={handleSetReplying}
                  sx={{
                    borderRadius: 999,
                    textTransform: "none",
                    fontWeight: 800,
                    boxShadow: "none",
                  }}
                >
                  {replying ? "Cancel" : "Reply"}
                </Button>
                {user && (isAuthor || user.isAdmin) && (
                  <HorizontalStack spacing={1}>
                    <CommentIconButton onClick={() => setEditing(!editing)}>
                      {editing ? <MdClose /> : <MdModeEditOutline />}
                    </CommentIconButton>
                    <CommentIconButton tone="error" onClick={handleDelete}>
                      {confirmDelete ? <MdCheck /> : <MdDeleteOutline />}
                    </CommentIconButton>
                  </HorizontalStack>
                )}
              </HorizontalStack>
            )}
          </Stack>
        )}

        {!minimised && (
          <Box sx={{ mt: 1.5 }} overflow="hidden">
            {!editing ? (
              <Box
                sx={{
                  color: "text.primary",
                  fontSize: 15,
                  lineHeight: 1.65,
                }}
              >
                <Markdown content={comment.content} />
              </Box>
            ) : (
              <ContentUpdateEditor
                handleSubmit={handleSubmit}
                originalContent={comment.content}
              />
            )}

            <HorizontalStack
              justifyContent="space-between"
              sx={{
                mt: 1.5,
                pt: 1.25,
                borderTop: "1px solid",
                borderColor: "divider",
              }}
            >
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ fontWeight: 700 }}
              >
                {childCount} {childCount === 1 ? "reply" : "replies"}
              </Typography>
            </HorizontalStack>

            {replying && (
              <Box sx={{ mt: 1.5 }}>
                <CommentEditor
                  comment={comment}
                  addComment={addComment}
                  setReplying={setReplying}
                  label="Write a short reply..."
                />
              </Box>
            )}
            {comment.children && comment.children.length > 0 && (
              <Box sx={{ pt: 1.5 }}>
                {comment.children.map((reply) => (
                  <Comment
                    key={reply._id}
                    comment={reply}
                    depth={depth + 1}
                    addComment={addComment}
                    removeComment={removeComment}
                    editComment={editComment}
                  />
                ))}
              </Box>
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Comment;
