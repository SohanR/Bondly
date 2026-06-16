import { Stack } from "@mui/material";
import React from "react";
import FindUsers from "./FindUsers";
import TopPosts from "./TopPosts";

const Sidebar = (props) => {
  return (
    <Stack spacing={2}>
      <TopPosts {...props} />
      <FindUsers />
    </Stack>
  );
};

export default Sidebar;
