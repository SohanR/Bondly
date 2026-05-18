import { Box, Typography } from "@mui/material";
import React from "react";
import UserAvatar from "./UserAvatar";
import HorizontalStack from "./util/HorizontalStack";

const Message = (props) => {
  const username = props.conservant.username;
  const message = props.message;
  const isOwn = message.direction === "from";

  return (
    <HorizontalStack
      sx={{ py: 0.75, width: "100%" }}
      spacing={1}
      justifyContent={isOwn ? "flex-end" : "flex-start"}
      alignItems="flex-end"
    >
      {!isOwn && <UserAvatar username={username} height={30} width={30} />}

      <Box
        sx={{
          maxWidth: "72%",
          px: 1.75,
          py: 1.15,
          borderRadius: isOwn ? "18px 18px 6px 18px" : "18px 18px 18px 6px",
          backgroundColor: isOwn ? "primary.main" : "grey.100",
          color: isOwn ? "primary.contrastText" : "text.primary",
          border: "1px solid",
          borderColor: isOwn ? "primary.main" : "divider",
          boxShadow: isOwn
            ? "0 10px 24px rgba(25, 118, 210, 0.2)"
            : "0 8px 20px rgba(15, 23, 42, 0.06)",
          overflowWrap: "anywhere",
        }}
      >
        <Typography variant="body2" sx={{ lineHeight: 1.55 }}>
          {message.content}
        </Typography>
      </Box>
    </HorizontalStack>
  );
};

export default Message;
