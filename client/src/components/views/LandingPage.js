import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Box,
  Button,
  Typography,
  Grid,
  AppBar,
  Toolbar,
} from "@mui/material";
import { BiSearch, BiMessageRounded, BiMessageAlt } from "react-icons/bi";
import "../../LandingPage.css";
import devSpaceLogo from "../../assets/devspace-logo.png";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      {/* Navbar */}
      <AppBar position="static" className="landing-navbar">
        <Toolbar className="landing-toolbar">
          <div className="navbar-brand">
            <img src={devSpaceLogo} alt="DevSpace" />
            <span>DevSpace</span>
          </div>
          <div className="navbar-actions">
            <Button
              variant="outlined"
              className="btn-login"
              onClick={() => navigate("/login")}
            >
              Log In
            </Button>
            <Button
              variant="contained"
              className="btn-signup"
              onClick={() => navigate("/signup")}
            >
              Join Us
            </Button>
          </div>
        </Toolbar>
      </AppBar>

      <section className="hero-section">
        <Container maxWidth="lg">
          <Box className="hero-layout">
            <Box className="hero-content">
              <Typography
                variant="h2"
                className="hero-headline fade-in-up"
                sx={{ fontWeight: 800, marginBottom: 2 }}
              >
                Search the idea.
                <br />
                Find your people.
              </Typography>

              <Typography
                variant="h5"
                className="hero-subheadline fade-in-up"
                sx={{
                  fontWeight: 400,
                  marginBottom: 4,
                  maxWidth: 620,
                }}
              >
                A search-first knowledge community where ideas connect people.
                Discover content, engage with creators, and build meaningful
                relationships through shared interests.
              </Typography>

              <Box className="hero-buttons">
                <Button
                  variant="contained"
                  size="large"
                  className="btn-explore fade-in-up"
                  onClick={() => navigate("/search")}
                >
                  Explore Content
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  className="btn-learn fade-in-up"
                  onClick={() => navigate("/signup")}
                >
                  Learn More
                </Button>
              </Box>
            </Box>

            <Box className="hero-visual" aria-hidden="true">
              <div className="visual-panel visual-panel-main">
                <div className="visual-search">
                  <BiSearch size={22} />
                  <span />
                </div>
                <div className="visual-thread">
                  <span className="visual-avatar" />
                  <div>
                    <span />
                    <span />
                  </div>
                </div>
                <div className="visual-thread compact">
                  <span className="visual-avatar alt" />
                  <div>
                    <span />
                    <span />
                  </div>
                </div>
                <div className="visual-actions">
                  <span />
                  <span />
                  <span />
                </div>
              </div>
              <div className="visual-panel visual-panel-chat">
                <BiMessageRounded size={22} />
                <span />
                <span />
              </div>
            </Box>
          </Box>
        </Container>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works">
        <Container maxWidth="lg">
          <Typography
            variant="h4"
            className="section-title"
            sx={{ fontWeight: 600, marginBottom: 5, textAlign: "center" }}
          >
            How It Works
          </Typography>

          <Grid container spacing={4}>
            <Grid item xs={12} sm={6} md={4}>
              <Box className="how-it-works-card">
                <div className="card-icon">
                  <BiSearch size={48} />
                </div>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 600, marginBottom: 1.5 }}
                >
                  Search Knowledge
                </Typography>
                <Typography variant="body2" sx={{ color: "#666" }}>
                  Find posts, ideas, and discussions about topics that matter to
                  you. Our advanced search makes discovery seamless.
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <Box className="how-it-works-card">
                <div className="card-icon">
                  <BiMessageAlt size={48} />
                </div>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 600, marginBottom: 1.5 }}
                >
                  Interact & React
                </Typography>
                <Typography variant="body2" sx={{ color: "#666" }}>
                  Like posts, leave comments, and engage with the community.
                  Your voice matters in shaping the conversation.
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <Box className="how-it-works-card">
                <div className="card-icon">
                  <BiMessageRounded size={48} />
                </div>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 600, marginBottom: 1.5 }}
                >
                  Real-time Chat
                </Typography>
                <Typography variant="body2" sx={{ color: "#666" }}>
                  Connect privately with other users. Have meaningful
                  conversations one-on-one in our Messenger.
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </section>

      {/* Footer CTA */}
      <section className="footer-cta">
        <Container maxWidth="md">
          <Box sx={{ textAlign: "center" }}>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 600,
                marginBottom: 3,
                color: "#1a1a2e",
              }}
            >
              Ready to discover your community?
            </Typography>
            <Button
              variant="contained"
              size="large"
              className="btn-cta"
              onClick={() => navigate("/signup")}
              sx={{
                fontSize: "1rem",
                padding: "12px 40px",
              }}
            >
              Join DevSpace Today
            </Button>
          </Box>
        </Container>
      </section>
    </div>
  );
};

export default LandingPage;
