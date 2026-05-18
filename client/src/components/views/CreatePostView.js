import { Container } from "@mui/material";
import React from "react";
import GoBack from "../GoBack";
import GridLayout from "../GridLayout";
import Navbar from "../Navbar";
import PostEditor from "../PostEditor";
import Sidebar from "../Sidebar";
import TopTags from "../TopTags";

const CreatePostView = () => {
  return (
    <Container>
      <Navbar />
      <GoBack />
      <GridLayout leftRail={<TopTags />} left={<PostEditor />} right={<Sidebar />} />
    </Container>
  );
};

export default CreatePostView;
