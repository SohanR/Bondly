import { Box, IconButton, TextField } from "@mui/material";
import React, { useState } from "react";
import { MdSend } from "react-icons/md";
import HorizontalStack from "./util/HorizontalStack";

const SendMessage = (props) => {
  const [content, setContent] = useState("");

  const handleSendMessage = () => {
    const nextContent = content.trim();
    if (!nextContent) return;

    props.onSendMessage(nextContent);
    setContent("");
  };

  return (
    <Box sx={{ p: 2, borderTop: "1px solid", borderColor: "divider" }}>
      <HorizontalStack
        sx={{
          borderRadius: 999,
          p: 0.75,
          backgroundColor: "grey.50",
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <TextField
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write a message..."
          fullWidth
          value={content}
          autoComplete="off"
          size="small"
          multiline
          maxRows={4}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey && content.trim().length > 0) {
              e.preventDefault();
              handleSendMessage();
            }
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 999,
              backgroundColor: "background.paper",
              "& fieldset": { border: 0 },
            },
          }}
        />

        <IconButton
          onClick={handleSendMessage}
          disabled={content.trim().length === 0}
          sx={{
            width: 42,
            height: 42,
            borderRadius: "50%",
            color: "primary.contrastText",
            backgroundColor: "primary.main",
            "&:hover": { backgroundColor: "primary.dark" },
            "&.Mui-disabled": {
              backgroundColor: "grey.300",
              color: "text.secondary",
            },
          }}
        >
          <MdSend />
        </IconButton>
      </HorizontalStack>
    </Box>
  );
};

export default SendMessage;
