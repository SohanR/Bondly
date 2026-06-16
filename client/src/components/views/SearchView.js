import { Container, Stack } from "@mui/material";
import React from "react";
import GridLayout from "../GridLayout";
import Navbar from "../Navbar";
import PostBrowser from "../PostBrowser";
import Sidebar from "../Sidebar";
import DiscoverRail from "../DiscoverRail";

const SearchView = () => {
  return (
    <Container>
      <Navbar />
      <GridLayout
        leftRail={<DiscoverRail />}
        left={
          <Stack spacing={2}>
            <PostBrowser createPost contentType="posts" />
          </Stack>
        }
        right={<Sidebar />}
      />
    </Container>
  );
};

export default SearchView;
