import { Box, Button, Card, Stack, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import { createSpacePost } from "../api/spaces";
import { isLoggedIn } from "../helpers/authHelper";
import ErrorAlert from "./ErrorAlert";

const SpacePostComposer = ({ space, onCreated }) => {
  const [formData, setFormData] = useState({ title: "", content: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const data = await createSpacePost(isLoggedIn(), space._id, formData);
    if (data?.error) {
      setError(data.error);
      return;
    }

    setFormData({ title: "", content: "" });
    onCreated(data);
  };

  return (
    <Card sx={{ borderRadius: 3, p: 2 }}>
      <Box component="form" onSubmit={handleSubmit}>
        <Stack spacing={1.5}>
          <Typography sx={{ fontWeight: 900 }}>Post in {space.name}</Typography>
          <TextField
            name="title"
            label="Post title"
            value={formData.title}
            onChange={handleChange}
            required
            fullWidth
          />
          <TextField
            name="content"
            label="Content"
            value={formData.content}
            onChange={handleChange}
            required
            multiline
            minRows={4}
            fullWidth
          />
          <ErrorAlert error={error} />
          <Button type="submit" variant="contained" sx={{ borderRadius: 999, fontWeight: 900 }}>
            Publish to Space
          </Button>
        </Stack>
      </Box>
    </Card>
  );
};

export default SpacePostComposer;
