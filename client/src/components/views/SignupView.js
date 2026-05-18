import { Button, Container, Stack, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React, { useState } from "react";
import { signup } from "../../api/users";
import { loginUser } from "../../helpers/authHelper";
import { Link, useNavigate } from "react-router-dom";
import Copyright from "../Copyright";
import ErrorAlert from "../ErrorAlert";
import { isLength, isEmail, contains } from "validator";
import "../../AuthPage.css";
import devSpaceLogo from "../../assets/devspace-logo.png";

const SignupView = () => {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState("");
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = validate();
    if (Object.keys(errors).length !== 0) return;

    const data = await signup(formData);

    if (data.error) {
      setServerError(data.error);
    } else {
      loginUser(data);
      navigate("/");
    }
  };

  const validate = () => {
    const errors = {};

    if (!isLength(formData.username, { min: 6, max: 30 })) {
      errors.username = "Must be between 6 and 30 characters long";
    }

    if (contains(formData.username, " ")) {
      errors.username = "Must contain only valid characters";
    }

    if (!isLength(formData.password, { min: 8 })) {
      errors.password = "Must be at least 8 characters long";
    }

    if (!isEmail(formData.email)) {
      errors.email = "Must be a valid email address";
    }

    setErrors(errors);

    return errors;
  };

  return (
    <Box className="auth-page">
      <Container maxWidth="xs">
        <Stack className="auth-card" alignItems="stretch">
          <Typography className="auth-brand" variant="h3">
            <Link to="/">
              <img src={devSpaceLogo} alt="DevSpace" />
              <span>DevSpace</span>
            </Link>
          </Typography>
          <Typography className="auth-title" variant="h4">
            Sign Up
          </Typography>
          <Typography className="auth-switch" color="text.secondary">
            Already have an account? <Link to="/login">Login</Link>
          </Typography>
          <Box className="auth-form" component="form" onSubmit={handleSubmit}>
            <TextField
              label="Username"
              fullWidth
              margin="normal"
              autoFocus
              required
              id="username"
              name="username"
              onChange={handleChange}
              error={errors.username !== undefined}
              helperText={errors.username}
            />
            <TextField
              label="Email Address"
              fullWidth
              margin="normal"
              autoComplete="email"
              required
              id="email"
              name="email"
              onChange={handleChange}
              error={errors.email !== undefined}
              helperText={errors.email}
            />
            <TextField
              label="Password"
              fullWidth
              required
              margin="normal"
              autoComplete="new-password"
              id="password"
              name="password"
              type="password"
              onChange={handleChange}
              error={errors.password !== undefined}
              helperText={errors.password}
            />
            <ErrorAlert error={serverError} />
            <Button
              className="auth-submit"
              type="submit"
              fullWidth
              variant="contained"
            >
              Sign Up
            </Button>
          </Box>
          <Box className="auth-footer">
            <Copyright />
          </Box>
        </Stack>
      </Container>
    </Box>
  );
};

export default SignupView;
