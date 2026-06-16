import {
  Button,
  Card,
  Checkbox,
  FormControlLabel,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { CIRCLE_STACKS } from "../constants/circles";
import ErrorAlert from "./ErrorAlert";

const CircleForm = ({ initialCircle, submitLabel, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: initialCircle?.name || "",
    description: initialCircle?.description || "",
    stack: initialCircle?.stack || "Backend",
    mode: initialCircle?.mode || "public",
    joinApprovalRequired: Boolean(initialCircle?.joinApprovalRequired),
    postApprovalRequired: Boolean(initialCircle?.postApprovalRequired),
    bannerImage: null,
    policyAccepted: Boolean(initialCircle),
  });
  const [error, setError] = useState("");
  const isEdit = Boolean(initialCircle);

  const handleChange = (e) => {
    const { name, value, files, checked, type } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.name.trim() || !formData.description.trim()) {
      setError("Name and short description are required");
      return;
    }

    if (!isEdit && !formData.bannerImage) {
      setError("Banner image is required");
      return;
    }

    if (!isEdit && !formData.policyAccepted) {
      setError("You must accept the Circle promise before creating a Circle");
      return;
    }

    const body = new FormData();
    body.append("name", formData.name.trim());
    body.append("description", formData.description.trim());
    body.append("stack", formData.stack);
    body.append("mode", formData.mode);
    body.append("joinApprovalRequired", String(formData.joinApprovalRequired));
    body.append("postApprovalRequired", String(formData.postApprovalRequired));
    body.append("policyAccepted", String(formData.policyAccepted));
    if (formData.bannerImage) body.append("bannerImage", formData.bannerImage);

    const result = await onSubmit(body);
    if (result?.error) setError(result.error);
  };

  return (
    <Card sx={{ borderRadius: 3, p: { xs: 2, sm: 3 } }}>
      <Stack component="form" spacing={2} onSubmit={handleSubmit}>
        <Typography variant="h5" sx={{ fontWeight: 900 }}>
          {isEdit ? "Circle Settings" : "Create Circle"}
        </Typography>
        <TextField
          label="Circle name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          fullWidth
        />
        <TextField
          label="Short description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          multiline
          minRows={3}
          fullWidth
        />
        <TextField
          select
          label="Tech stack"
          name="stack"
          value={formData.stack}
          onChange={handleChange}
          required
          fullWidth
        >
          {CIRCLE_STACKS.map((stack) => (
            <MenuItem key={stack} value={stack}>
              {stack}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          select
          label="Circle mode"
          name="mode"
          value={formData.mode}
          onChange={handleChange}
          helperText="Public Circles can be read by everyone. Private Circles only show posts to approved members."
          required
          fullWidth
        >
          <MenuItem value="public">Public</MenuItem>
          <MenuItem value="private">Private</MenuItem>
        </TextField>
        <FormControlLabel
          control={
            <Checkbox
              name="joinApprovalRequired"
              checked={formData.joinApprovalRequired}
              onChange={handleChange}
            />
          }
          label="Admin must approve new members"
        />
        <FormControlLabel
          control={
            <Checkbox
              name="postApprovalRequired"
              checked={formData.postApprovalRequired}
              onChange={handleChange}
            />
          }
          label="Admin must approve member posts"
        />
        <Button variant="outlined" component="label" sx={{ justifyContent: "flex-start" }}>
          {formData.bannerImage ? formData.bannerImage.name : "Choose banner image"}
          <input hidden type="file" name="bannerImage" accept="image/*" onChange={handleChange} />
        </Button>
        {!isEdit && (
          <FormControlLabel
            control={
              <Checkbox
                name="policyAccepted"
                checked={formData.policyAccepted}
                onChange={handleChange}
              />
            }
            label="I agree to the terms and promise not to share scams, illegal content, or adult content in this Circle."
          />
        )}
        <ErrorAlert error={error} />
        <Button type="submit" variant="contained" sx={{ borderRadius: 999, fontWeight: 900 }}>
          {submitLabel}
        </Button>
      </Stack>
    </Card>
  );
};

export default CircleForm;
