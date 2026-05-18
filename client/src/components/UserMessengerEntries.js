import { Box, List, Stack, Typography } from "@mui/material";
import React from "react";
import { MdForum, MdPersonSearch } from "react-icons/md";
import Loading from "./Loading";
import UserMessengerEntry from "./UserMessengerEntry";
import HorizontalStack from "./util/HorizontalStack";

const UserMessengerEntries = (props) => {
  const conversations = Array.isArray(props.conversations)
    ? props.conversations.filter((conversation) => conversation?.recipient)
    : [];

  return !props.loading ? (
    <>
      {conversations.length > 0 ? (
        <Stack sx={{ height: "100%" }}>
          <Box sx={{ px: 2, py: 2 }}>
            <HorizontalStack spacing={1.25}>
              <Box
                sx={{
                  width: 38,
                  height: 38,
                  borderRadius: "50%",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "primary.main",
                  backgroundColor: "rgba(25, 118, 210, 0.08)",
                  fontSize: 21,
                }}
              >
                <MdForum />
              </Box>
              <Box>
                <Typography sx={{ fontWeight: 900, lineHeight: 1.1 }}>
                  Conversations
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {conversations.length} active chat
                  {conversations.length === 1 ? "" : "s"}
                </Typography>
              </Box>
            </HorizontalStack>
          </Box>
          <List sx={{ p: 0, overflowY: "auto", flex: 1 }}>
            {conversations.map((conversation) => (
              <UserMessengerEntry
                conservant={props.conservant}
                conversation={conversation}
                key={conversation._id || conversation.recipient._id}
                setConservant={props.setConservant}
              />
            ))}
          </List>
        </Stack>
      ) : (
        <Stack
          sx={{ height: "100%", p: 3 }}
          justifyContent="center"
          alignItems="center"
          spacing={1.25}
          textAlign="center"
        >
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: "50%",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              color: "primary.main",
              backgroundColor: "rgba(25, 118, 210, 0.08)",
              fontSize: 28,
            }}
          >
            <MdPersonSearch />
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 900 }}>
            No conversations yet
          </Typography>
          <Typography color="text.secondary" variant="body2">
            Open a profile and tap Message to start a private conversation.
          </Typography>
        </Stack>
      )}
    </>
  ) : (
    <Stack sx={{ height: "100%" }} justifyContent="center">
      <Loading />
    </Stack>
  );
};

export default UserMessengerEntries;
