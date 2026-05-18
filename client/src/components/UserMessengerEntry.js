import { Box, ListItemAvatar, MenuItem, Typography } from "@mui/material";
import React from "react";
import moment from "moment";
import UserAvatar from "./UserAvatar";

const UserMessengerEntry = (props) => {
  const recipient = props.conversation.recipient;
  const username = recipient.username;
  const selected =
    props.conservant && props.conservant.username === recipient.username;

  const handleClick = () => {
    props.setConservant(recipient);
  };

  return (
    <MenuItem
      onClick={handleClick}
      selected={selected}
      sx={{
        mx: 1,
        my: 0.5,
        p: 1.25,
        borderRadius: 3,
        whiteSpace: "normal",
        "&.Mui-selected": {
          backgroundColor: "rgba(25, 118, 210, 0.1)",
        },
        "&.Mui-selected:hover, &:hover": {
          backgroundColor: "rgba(25, 118, 210, 0.12)",
        },
      }}
    >
      <ListItemAvatar sx={{ minWidth: 48 }}>
        <UserAvatar height={40} width={40} username={username} />
      </ListItemAvatar>
      <Box sx={{ minWidth: 0 }}>
        <Typography sx={{ fontWeight: 800 }} noWrap>
          {username}
        </Typography>
        <Typography variant="caption" color="text.secondary" noWrap>
          {props.conversation.new
            ? "New conversation"
            : moment(props.conversation.lastMessageAt).fromNow()}
        </Typography>
      </Box>
    </MenuItem>
  );
};

export default UserMessengerEntry;
