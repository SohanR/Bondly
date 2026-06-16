import { Stack } from "@mui/material";
import React from "react";
import TopSpaces from "./TopSpaces";
import TopTags from "./TopTags";
import TopCircles from "./TopCircles";

const DiscoverRail = () => {
  return (
    <Stack spacing={2}>
      <TopTags />
      <TopSpaces />
      <TopCircles />
    </Stack>
  );
};

export default DiscoverRail;
