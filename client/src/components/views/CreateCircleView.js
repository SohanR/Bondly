import { Container } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
import { createCircle } from "../../api/circles";
import { isLoggedIn } from "../../helpers/authHelper";
import CircleForm from "../CircleForm";
import DiscoverRail from "../DiscoverRail";
import GoBack from "../GoBack";
import GridLayout from "../GridLayout";
import Navbar from "../Navbar";
import Sidebar from "../Sidebar";

const CreateCircleView = () => {
  const navigate = useNavigate();

  const handleSubmit = async (formData) => {
    const data = await createCircle(isLoggedIn(), formData);
    if (data?.data?.slug) {
      navigate("/circles/" + data.data.slug);
    }
    return data;
  };

  return (
    <Container>
      <Navbar />
      <GoBack />
      <GridLayout
        leftRail={<DiscoverRail />}
        left={<CircleForm submitLabel="Create Circle" onSubmit={handleSubmit} />}
        right={<Sidebar />}
      />
    </Container>
  );
};

export default CreateCircleView;
