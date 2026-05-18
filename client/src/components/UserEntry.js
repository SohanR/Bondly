import React from "react";
import HorizontalStack from "./util/HorizontalStack";
import UserAvatar from "./UserAvatar";
import { Button, Typography } from "@mui/material";
import { Link } from "react-router-dom";

const UserEntry = ({ username, name }) => {
  const hasName = Boolean(name && name !== username);

  return (
    <HorizontalStack
      justifyContent="space-between"
      key={username}
      sx={{
        borderRadius: 3,
        px: 1.25,
        py: 1,
        backgroundColor: "grey.50",
        border: "1px solid",
        borderColor: "divider",
      }}
    >
      <HorizontalStack>
        <UserAvatar width={38} height={38} username={username} />
        <div>
          {hasName && <Typography sx={{ fontWeight: 700 }}>{name}</Typography>}
          <Typography
            color={hasName ? "text.secondary" : "text.primary"}
            sx={{ fontWeight: hasName ? 600 : 700 }}
            variant={hasName ? "caption" : "body1"}
          >
            {hasName ? `@${username}` : username}
          </Typography>
        </div>
      </HorizontalStack>
      <Button
        component={Link}
        to={"/users/" + username}
        variant="contained"
        size="small"
        sx={{
          borderRadius: 999,
          px: 1.75,
          textTransform: "none",
          fontWeight: 700,
          boxShadow: "none",
        }}
      >
        View
      </Button>
    </HorizontalStack>
  );
};

export default UserEntry;
