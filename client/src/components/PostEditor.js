import {
  Box,
  Button,
  Card,
  Divider,
  IconButton,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useRef, useState } from "react";
import {
  MdCode,
  MdFormatBold,
  MdFormatItalic,
  MdFormatListBulleted,
  MdFormatListNumbered,
  MdFormatQuote,
  MdLink,
  MdSend,
  MdShortText,
  MdTitle,
} from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { createPost } from "../api/posts";
import { isLoggedIn } from "../helpers/authHelper";
import ErrorAlert from "./ErrorAlert";
import UserAvatar from "./UserAvatar";
import HorizontalStack from "./util/HorizontalStack";

const formatActions = [
  {
    label: "Bold",
    icon: <MdFormatBold />,
    before: "**",
    after: "**",
    fallback: "bold text",
  },
  {
    label: "Italic",
    icon: <MdFormatItalic />,
    before: "*",
    after: "*",
    fallback: "italic text",
  },
  {
    label: "Heading",
    icon: <MdTitle />,
    before: "## ",
    after: "",
    fallback: "Heading",
    block: true,
  },
  {
    label: "Quote",
    icon: <MdFormatQuote />,
    before: "> ",
    after: "",
    fallback: "Quote",
    block: true,
  },
  {
    label: "Bullet list",
    icon: <MdFormatListBulleted />,
    before: "- ",
    after: "",
    fallback: "List item",
    block: true,
  },
  {
    label: "Numbered list",
    icon: <MdFormatListNumbered />,
    before: "1. ",
    after: "",
    fallback: "List item",
    block: true,
  },
  {
    label: "Link",
    icon: <MdLink />,
    before: "[",
    after: "](https://)",
    fallback: "link text",
  },
  {
    label: "Code",
    icon: <MdCode />,
    before: "`",
    after: "`",
    fallback: "code",
  },
];

const PostEditor = () => {
  const navigate = useNavigate();
  const contentRef = useRef(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    content: "",
  });

  const [serverError, setServerError] = useState("");
  const [errors, setErrors] = useState({});
  const user = isLoggedIn();

  const handleChange = (e) => {
    const nextFormData = { ...formData, [e.target.name]: e.target.value };
    setFormData(nextFormData);
    setErrors(validate(nextFormData));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const nextErrors = validate(formData);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setLoading(true);
    const data = await createPost(formData, isLoggedIn());
    setLoading(false);
    if (data && data.error) {
      setServerError(data.error);
    } else {
      navigate("/posts/" + data._id);
    }
  };

  const validate = (data) => {
    const errors = {};

    if (!data.title.trim()) {
      errors.title = "Title is required";
    }

    if (!data.content.trim()) {
      errors.content = "Content is required";
    }

    return errors;
  };

  const applyFormat = (action) => {
    const input = contentRef.current;
    if (!input) return;

    const start = input.selectionStart;
    const end = input.selectionEnd;
    const selected = formData.content.slice(start, end);
    const text = selected || action.fallback;
    const prefix = action.block && start > 0 && formData.content[start - 1] !== "\n" ? "\n" : "";
    const formatted = `${prefix}${action.before}${text}${action.after}`;
    const nextContent =
      formData.content.slice(0, start) + formatted + formData.content.slice(end);

    setFormData({ ...formData, content: nextContent });

    window.setTimeout(() => {
      input.focus();
      const selectionStart = start + prefix.length + action.before.length;
      const selectionEnd = selectionStart + text.length;
      input.setSelectionRange(selectionStart, selectionEnd);
    }, 0);
  };

  return (
    <Card
      sx={{
        borderRadius: 3,
        p: { xs: 2, sm: 3 },
        background:
          "linear-gradient(135deg, rgba(25, 118, 210, 0.06), rgba(15, 23, 42, 0.02))",
      }}
    >
      <Stack spacing={2.25}>
        {user && (
          <HorizontalStack spacing={1.5} alignItems="center">
            <UserAvatar width={48} height={48} username={user.username} />
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 900, lineHeight: 1.15 }}>
                Create something worth sharing
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Posting as {user.username}
              </Typography>
            </Box>
          </HorizontalStack>
        )}

        <Box
          sx={{
            borderRadius: 3,
            p: { xs: 1.5, sm: 2 },
            backgroundColor: "background.paper",
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={2}>
              <TextField
                fullWidth
                label="Post title"
                placeholder="Give your post a clear title"
                required
                name="title"
                value={formData.title}
                onChange={handleChange}
                error={errors.title !== undefined}
                helperText={errors.title}
                InputProps={{
                  startAdornment: (
                    <Box sx={{ mr: 1, color: "text.secondary", display: "flex" }}>
                      <MdShortText />
                    </Box>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 3,
                    backgroundColor: "grey.50",
                  },
                }}
              />

              <Box
                sx={{
                  borderRadius: 3,
                  border: "1px solid",
                  borderColor: errors.content ? "error.main" : "divider",
                  overflow: "hidden",
                  backgroundColor: "background.paper",
                }}
              >
                <HorizontalStack
                  spacing={0.5}
                  sx={{
                    px: 1,
                    py: 0.75,
                    flexWrap: "wrap",
                    backgroundColor: "grey.50",
                    borderBottom: "1px solid",
                    borderColor: "divider",
                  }}
                >
                  {formatActions.map((action) => (
                    <Tooltip title={action.label} key={action.label}>
                      <IconButton
                        size="small"
                        onClick={() => applyFormat(action)}
                        sx={{
                          width: 34,
                          height: 34,
                          borderRadius: "50%",
                          color: "text.secondary",
                          "&:hover": {
                            color: "primary.main",
                            backgroundColor: "rgba(25, 118, 210, 0.08)",
                          },
                        }}
                      >
                        {action.icon}
                      </IconButton>
                    </Tooltip>
                  ))}
                  <Divider flexItem orientation="vertical" sx={{ mx: 0.5 }} />
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ fontWeight: 700, px: 0.75 }}
                  >
                    Markdown supported
                  </Typography>
                </HorizontalStack>

                <TextField
                  fullWidth
                  placeholder="Write your story, question, or update..."
                  multiline
                  minRows={8}
                  maxRows={18}
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  inputRef={contentRef}
                  error={errors.content !== undefined}
                  helperText={errors.content}
                  required
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 0,
                      "& fieldset": {
                        border: 0,
                      },
                    },
                    "& .MuiInputBase-input": {
                      fontSize: 15,
                      lineHeight: 1.65,
                    },
                    "& .MuiFormHelperText-root": {
                      mx: 2,
                      mb: 1,
                    },
                  }}
                />
              </Box>

              <ErrorAlert error={serverError} />
              <HorizontalStack justifyContent="space-between">
                <Typography variant="body2" color="text.secondary">
                  Use the toolbar for quick formatting.
                </Typography>
                <Button
                  variant="contained"
                  type="submit"
                  disabled={loading}
                  startIcon={<MdSend />}
                  sx={{
                    borderRadius: 999,
                    px: 2.5,
                    py: 1,
                    textTransform: "none",
                    fontWeight: 900,
                    boxShadow: "0 12px 28px rgba(25, 118, 210, 0.22)",
                  }}
                >
                  {loading ? "Publishing" : "Publish post"}
                </Button>
              </HorizontalStack>
            </Stack>
          </Box>
        </Box>
      </Stack>
    </Card>
  );
};

export default PostEditor;
