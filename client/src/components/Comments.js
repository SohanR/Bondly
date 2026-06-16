import { Box, Card, Stack, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { MdChatBubbleOutline } from "react-icons/md";
import Comment from "./Comment";
import Loading from "./Loading";
import { getComments } from "../api/posts";
import { useParams } from "react-router-dom";
import CommentEditor from "./CommentEditor";
import { isLoggedIn } from "../helpers/authHelper";

const Comments = () => {
  const [comments, setComments] = useState(null);
  const [rerender, setRerender] = useState(false);
  const params = useParams();
  const user = isLoggedIn();

  const fetchComments = async () => {
    const data = await getComments(params, user && user.token);
    if (!data.error) {
      setComments(data);
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  const findComment = (id) => {
    let commentToFind;

    const recurse = (comment, id) => {
      if (comment._id === id) {
        commentToFind = comment;
      } else {
        for (let i = 0; i < comment.children.length; i++) {
          const commentToSearch = comment.children[i];
          recurse(commentToSearch, id);
        }
      }
    };

    for (let i = 0; i < comments.length; i++) {
      const comment = comments[i];
      recurse(comment, id);
    }

    return commentToFind;
  };

  const removeComment = (removedComment) => {
    if (removedComment.parent) {
      const parentComment = findComment(removedComment.parent);
      parentComment.children = parentComment.children.filter(
        (comment) => comment._id !== removedComment._id
      );
      setRerender(!rerender);
    } else {
      setComments(
        comments.filter((comment) => comment._id !== removedComment._id)
      );
    }
  };

  const editComment = (editedComment) => {
    if (editedComment.parent) {
      let parentComment = findComment(editedComment.parent);
      for (let i = 0; i < parentComment.children.length; i++) {
        if (parentComment.children[i]._id === editedComment._id) {
          parentComment.children[i] = editedComment;
        }
      }
    } else {
      for (let i = 0; i < comments.length; i++) {
        if (comments[i]._id === editedComment._id) {
          comments[i] = editedComment;
        }
      }
      setRerender(!rerender);
    }
  };

  const addComment = (comment) => {
    if (comment.parent) {
      const parentComment = findComment(comment.parent);
      parentComment.children = [comment, ...parentComment.children];

      setRerender(!rerender);
    } else {
      setComments([comment, ...comments]);
    }
  };

  return comments ? (
    <Stack spacing={2}>
      <CommentEditor
        addComment={addComment}
        label="Share your thoughts..."
      />

      {comments.length > 0 ? (
        <Card sx={{ borderRadius: 3, p: { xs: 1.5, sm: 2 } }}>
          <Stack spacing={1.5}>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 800 }}>
                Comments
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {comments.length} {comments.length === 1 ? "comment" : "comments"}
              </Typography>
            </Box>
            <Box>
              {comments.map((comment) => (
                <Comment
                  addComment={addComment}
                  removeComment={removeComment}
                  editComment={editComment}
                  comment={comment}
                  key={comment._id}
                  depth={0}
                />
              ))}
            </Box>
          </Stack>
        </Card>
      ) : (
        <Card sx={{ borderRadius: 3, p: 4 }}>
          <Stack alignItems="center" textAlign="center" spacing={1}>
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: "50%",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                color: "primary.main",
                backgroundColor: "rgba(25, 118, 210, 0.08)",
                fontSize: 24,
              }}
            >
              <MdChatBubbleOutline />
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 800 }}>
              No comments yet
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Start the discussion with a thoughtful comment.
            </Typography>
          </Stack>
        </Card>
      )}
    </Stack>
  ) : (
    <Loading label="Loading comments" />
  );
};

export default Comments;
