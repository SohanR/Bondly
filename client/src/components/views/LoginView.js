import {
  Button,
  Container,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../../api/users";
import ErrorAlert from "../ErrorAlert";
import { loginUser } from "../../helpers/authHelper";
import Copyright from "../Copyright";
import "../../AuthPage.css";
import devSpaceLogo from "../../assets/devspace-logo.png";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";

const LoginView = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [serverError, setServerError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = await login(formData);
    if (data.error) {
      setServerError(data.error);
    } else {
      loginUser(data);
      navigate("/");
    }
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
            Login
          </Typography>
          <Typography className="auth-switch" color="text.secondary">
            Don't have an account yet? <Link to="/signup">Sign Up</Link>
          </Typography>
          <Box className="auth-form" component="form" onSubmit={handleSubmit}>
            <TextField
              label="Email Address"
              fullWidth
              margin="normal"
              autoComplete="email"
              autoFocus
              required
              id="email"
              name="email"
              onChange={handleChange}
            />
            <TextField
              label="Password"
              fullWidth
              required
              margin="normal"
              id="password"
              name="password"
              onChange={handleChange}
              type={showPassword ? "text" : "password"}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <MdVisibilityOff /> : <MdVisibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <ErrorAlert error={serverError} />
            <Button
              className="auth-submit"
              type="submit"
              fullWidth
              variant="contained"
            >
              Login
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

export default LoginView;
