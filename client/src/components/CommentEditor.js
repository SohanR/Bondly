import {
  Box,
  Button,
  Card,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { MdReply, MdSend } from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";
import { createComment } from "../api/posts";
import { isLoggedIn } from "../helpers/authHelper";
import ErrorAlert from "./ErrorAlert";
import HorizontalStack from "./util/HorizontalStack";

const CommentEditor = ({ label, comment, addComment, setReplying }) => {
  const maxChars = comment ? 200 : 500;
  const [formData, setFormData] = useState({
    content: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const params = useParams();
  const navigate = useNavigate();
  const remaining = maxChars - formData.content.length;
  const isReply = Boolean(comment);

  const handleChange = (e) => {
    const value = e.target.value.slice(0, maxChars);
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.content.trim()) {
      return;
    }

    const body = {
      ...formData,
      parentId: comment && comment._id,
    };

    setLoading(true);
    const data = await createComment(body, params, isLoggedIn());
    setLoading(false);

    if (data.error) {
      setError(data.error);
    } else {
      setFormData({ content: "" });
      setReplying && setReplying(false);
      addComment(data);
    }
  };

  const handleFocus = () => {
    !isLoggedIn() && navigate("/login");
  };

  return (
    <Card
      sx={{
        borderRadius: 3,
        p: isReply ? 1.5 : 2,
        backgroundColor: isReply ? "grey.50" : "background.paper",
      }}
    >
      <Stack spacing={1.5}>
        <Box>
          <Typography
            variant={isReply ? "subtitle1" : "h6"}
            sx={{ fontWeight: 800, lineHeight: 1.2 }}
          >
            {isReply ? "Write a reply" : "Join the conversation"}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Markdown is supported for formatting.
          </Typography>
        </Box>

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            multiline
            fullWidth
            placeholder={label}
            minRows={isReply ? 2 : 3}
            maxRows={8}
            required
            name="content"
            inputProps={{ maxLength: maxChars }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 3,
                backgroundColor: "background.paper",
                alignItems: "flex-start",
              },
              "& .MuiInputBase-input": {
                fontSize: 14,
                lineHeight: 1.55,
              },
            }}
            onChange={handleChange}
            onFocus={handleFocus}
            value={formData.content}
          />

          <ErrorAlert error={error} sx={{ my: 2 }} />
          <HorizontalStack justifyContent="space-between" sx={{ mt: 1.25 }}>
            <Typography
              variant="caption"
              color={remaining <= 30 ? "error.main" : "text.secondary"}
              sx={{ fontWeight: 700 }}
            >
              {remaining} characters remaining
            </Typography>
            <Button
              variant="contained"
              type="submit"
              disabled={loading || !formData.content.trim()}
              startIcon={isReply ? <MdReply /> : <MdSend />}
              sx={{
                borderRadius: 999,
                px: 2,
                textTransform: "none",
                fontWeight: 800,
                boxShadow: "0 10px 24px rgba(25, 118, 210, 0.2)",
              }}
            >
              {loading ? "Submitting" : isReply ? "Reply" : "Comment"}
            </Button>
          </HorizontalStack>
        </Box>
      </Stack>
    </Card>
  );
};

export default CommentEditor;
