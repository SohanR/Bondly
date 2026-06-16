import { Container } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
import { createSpace } from "../../api/spaces";
import { isLoggedIn } from "../../helpers/authHelper";
import DiscoverRail from "../DiscoverRail";
import GoBack from "../GoBack";
import GridLayout from "../GridLayout";
import Navbar from "../Navbar";
import Sidebar from "../Sidebar";
import SpaceForm from "../SpaceForm";

const CreateSpaceView = () => {
  const navigate = useNavigate();

  const handleSubmit = async (formData) => {
    const data = await createSpace(isLoggedIn(), formData);
    if (data?.data?.slug) {
      navigate("/spaces/" + data.data.slug);
    }
    return data;
  };

  return (
    <Container>
      <Navbar />
      <GoBack />
      <GridLayout
        leftRail={<DiscoverRail />}
        left={<SpaceForm submitLabel="Create Space" onSubmit={handleSubmit} />}
        right={<Sidebar />}
      />
    </Container>
  );
};

export default CreateSpaceView;
