import { Container } from "@mui/material";
import React from "react";
import GridLayout from "../GridLayout";
import Navbar from "../Navbar";
import Sidebar from "../Sidebar";
import PostBrowser from "../PostBrowser";
import DiscoverRail from "../DiscoverRail";

const ExploreView = () => {
  return (
    <Container>
      <Navbar />
      <GridLayout
        leftRail={<DiscoverRail />}
        left={<PostBrowser createPost contentType="posts" />}
        right={<Sidebar />}
      />
    </Container>
  );
};

export default ExploreView;
