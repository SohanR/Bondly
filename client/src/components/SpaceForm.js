import {
  Button,
  Card,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { SPACE_LINK_TYPES, SPACE_SPECIALIZATIONS } from "../constants/spaces";
import ErrorAlert from "./ErrorAlert";

const buildLinks = (formData) => {
  return [0, 1]
    .map((index) => ({
      type: formData[`linkType${index}`],
      url: formData[`linkUrl${index}`].trim(),
    }))
    .filter((link) => link.type && link.url);
};

const SpaceForm = ({ initialSpace, submitLabel, onSubmit, onUnpublish }) => {
  const [formData, setFormData] = useState({
    name: initialSpace?.name || "",
    about: initialSpace?.about || "",
    specialization: initialSpace?.specialization || "Backend",
    avatarImage: null,
    bannerImage: null,
    linkType0: initialSpace?.links?.[0]?.type || "",
    linkUrl0: initialSpace?.links?.[0]?.url || "",
    linkType1: initialSpace?.links?.[1]?.type || "",
    linkUrl1: initialSpace?.links?.[1]?.url || "",
  });
  const [error, setError] = useState("");
  const [pendingBody, setPendingBody] = useState(null);
  const [policyOpen, setPolicyOpen] = useState(false);
  const isEdit = Boolean(initialSpace);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({ ...formData, [name]: files ? files[0] : value });
  };

  const buildSubmitBody = () => {
    if (!formData.name.trim() || !formData.about.trim()) {
      setError("Name and about are required");
      return null;
    }

    if (!isEdit && (!formData.avatarImage || !formData.bannerImage)) {
      setError("Avatar and banner images are required");
      return null;
    }

    const body = new FormData();
    body.append("name", formData.name.trim());
    body.append("about", formData.about.trim());
    body.append("specialization", formData.specialization);
    body.append("links", JSON.stringify(buildLinks(formData)));
    body.append("policyAccepted", "true");
    if (formData.avatarImage) body.append("avatarImage", formData.avatarImage);
    if (formData.bannerImage) body.append("bannerImage", formData.bannerImage);

    return body;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const body = buildSubmitBody();
    if (!body) return;

    if (!isEdit) {
      setPendingBody(body);
      setPolicyOpen(true);
      return;
    }

    const result = await onSubmit(body);
    if (result?.error) setError(result.error);
  };

  const handlePolicyConfirm = async () => {
    if (!pendingBody) return;

    setPolicyOpen(false);
    const result = await onSubmit(pendingBody);
    if (result?.error) setError(result.error);
    setPendingBody(null);
  };

  return (
    <>
      <Card sx={{ borderRadius: 3, p: { xs: 2, sm: 3 } }}>
        <Stack component="form" spacing={2} onSubmit={handleSubmit}>
          <Typography variant="h5" sx={{ fontWeight: 900 }}>
            {isEdit ? "Space Settings" : "Create Space"}
          </Typography>
          <TextField
            label="Space name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            fullWidth
          />
          <TextField
            label="About"
            name="about"
            value={formData.about}
            onChange={handleChange}
            required
            multiline
            minRows={4}
            fullWidth
          />
          <TextField
            select
            label="Specialization"
            name="specialization"
            value={formData.specialization}
            onChange={handleChange}
            required
            fullWidth
          >
            {SPACE_SPECIALIZATIONS.map((specialization) => (
              <MenuItem key={specialization} value={specialization}>
                {specialization}
              </MenuItem>
            ))}
          </TextField>
          <Button
            variant="outlined"
            component="label"
            sx={{ justifyContent: "flex-start" }}
          >
            {formData.avatarImage
              ? formData.avatarImage.name
              : "Choose avatar image"}
            <input
              hidden
              type="file"
              name="avatarImage"
              accept="image/*"
              onChange={handleChange}
            />
          </Button>
          <Button
            variant="outlined"
            component="label"
            sx={{ justifyContent: "flex-start" }}
          >
            {formData.bannerImage
              ? formData.bannerImage.name
              : "Choose banner image"}
            <input
              hidden
              type="file"
              name="bannerImage"
              accept="image/*"
              onChange={handleChange}
            />
          </Button>

          {[0, 1].map((index) => (
            <Stack direction={{ xs: "column", sm: "row" }} spacing={1} key={index}>
              <TextField
                select
                label={`Link ${index + 1}`}
                name={`linkType${index}`}
                value={formData[`linkType${index}`]}
                onChange={handleChange}
                sx={{ minWidth: 160 }}
              >
                <MenuItem value="">None</MenuItem>
                {SPACE_LINK_TYPES.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                label="URL"
                name={`linkUrl${index}`}
                value={formData[`linkUrl${index}`]}
                onChange={handleChange}
                fullWidth
              />
            </Stack>
          ))}

          <ErrorAlert error={error} />
          <Button
            type="submit"
            variant="contained"
            sx={{ borderRadius: 999, fontWeight: 900 }}
          >
            {submitLabel}
          </Button>
          {isEdit && onUnpublish && (
            <Button
              type="button"
              variant="outlined"
              color="error"
              onClick={onUnpublish}
              sx={{ borderRadius: 999, fontWeight: 900 }}
            >
              Unpublish Space
            </Button>
          )}
        </Stack>
      </Card>

      <Dialog open={policyOpen} onClose={() => setPolicyOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 900 }}>Agree to DevSpace policies</DialogTitle>
        <DialogContent>
          <Typography color="text.secondary" sx={{ lineHeight: 1.7 }}>
            By creating this Space, you agree to our policy and terms and
            condition. You are responsible for the Space name, images, links,
            posts, and community activity published through this Space.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setPolicyOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handlePolicyConfirm}>
            I agree, create Space
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default SpaceForm;
