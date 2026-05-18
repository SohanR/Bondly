import { Container } from "@mui/material";
import React from "react";
import GridLayout from "../GridLayout";
import Navbar from "../Navbar";
import Sidebar from "../Sidebar";
import PostBrowser from "../PostBrowser";
import TopTags from "../TopTags";

const ExploreView = () => {
  return (
    <Container>
      <Navbar />
      <GridLayout
        leftRail={<TopTags />}
        left={<PostBrowser createPost contentType="posts" />}
        right={<Sidebar />}
      />
    </Container>
  );
};

export default ExploreView;
