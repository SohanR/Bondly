import { Box, Button, Card, Stack, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import { createCirclePost } from "../api/circles";
import { isLoggedIn } from "../helpers/authHelper";
import ErrorAlert from "./ErrorAlert";

const CirclePostComposer = ({ circle, onCreated }) => {
  const [formData, setFormData] = useState({ title: "", content: "" });
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setNotice("");

    const data = await createCirclePost(isLoggedIn(), circle._id, formData);
    if (data?.error) {
      setError(data.error);
      return;
    }

    setFormData({ title: "", content: "" });
    if (data.status === "pending") {
      setNotice("Post submitted for admin approval.");
      return;
    }
    onCreated(data);
  };

  return (
    <Card sx={{ borderRadius: 3, p: 2 }}>
      <Box component="form" onSubmit={handleSubmit}>
        <Stack spacing={1.5}>
          <Box>
            <Typography sx={{ fontWeight: 900 }}>Start a discussion in {circle.name}</Typography>
            <Typography variant="body2" color="text.secondary">
              Email verification and GitHub connection are required for Circle posts.
            </Typography>
          </Box>
          <TextField
            name="title"
            label="Discussion title"
            value={formData.title}
            onChange={handleChange}
            required
            fullWidth
          />
          <TextField
            name="content"
            label="Details"
            value={formData.content}
            onChange={handleChange}
            required
            multiline
            minRows={4}
            fullWidth
          />
          <ErrorAlert error={error} />
          {notice && (
            <Typography variant="body2" color="success.main" sx={{ fontWeight: 800 }}>
              {notice}
            </Typography>
          )}
          <Button type="submit" variant="contained" sx={{ borderRadius: 999, fontWeight: 900 }}>
            Publish to Circle
          </Button>
        </Stack>
      </Box>
    </Card>
  );
};

export default CirclePostComposer;
