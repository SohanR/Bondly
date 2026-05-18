import {
  Button,
  IconButton,
  Stack,
  TextField,
  Tooltip,
  Typography,
  InputAdornment,
} from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect, useState } from "react";
import {
  AiFillHome,
  AiFillMessage,
  AiOutlineSearch,
} from "react-icons/ai";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { isLoggedIn, logoutUser } from "../helpers/authHelper";
import devSpaceLogo from "../assets/devspace-logo.png";
import UserAvatar from "./UserAvatar";

const Navbar = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const user = isLoggedIn();
  const username = user && isLoggedIn().username;
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [searchIcon, setSearchIcon] = useState(false);
  const [width, setWindowWidth] = useState(0);

  useEffect(() => {
    updateDimensions();

    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  useEffect(() => {
    setSearch(searchParams.get("search") || "");
  }, [searchParams]);

  const mobile = width < 500;
  const navbarWidth = width < 600;

  const updateDimensions = () => {
    const width = window.innerWidth;
    setWindowWidth(width);
  };

  const handleLogout = async (e) => {
    logoutUser();
    navigate("/login");
  };

  const handleChange = (e) => {
    setSearch(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmedSearch = search.trim();

    if (!trimmedSearch) {
      navigate("/search");
      return;
    }

    navigate("/search?" + new URLSearchParams({ search: trimmedSearch }));
  };

  const handleSearchIcon = (e) => {
    setSearchIcon(!searchIcon);
  };

  const navIconStyles = {
    width: 40,
    height: 40,
    color: "#475569",
    border: "1px solid transparent",
    "&:hover": {
      color: "#2563eb",
      backgroundColor: "#eff6ff",
      borderColor: "rgba(37, 99, 235, 0.16)",
    },
  };

  const searchFieldStyles = {
    width: navbarWidth ? "100%" : 360,
    "& .MuiOutlinedInput-root": {
      height: 44,
      borderRadius: "8px",
      backgroundColor: "#f8fafc",
      transition: "background-color 160ms ease, box-shadow 160ms ease",
      "& fieldset": {
        borderColor: "rgba(15, 23, 42, 0.1)",
      },
      "&:hover": {
        backgroundColor: "#ffffff",
      },
      "&:hover fieldset": {
        borderColor: "rgba(37, 99, 235, 0.34)",
      },
      "&.Mui-focused": {
        backgroundColor: "#ffffff",
        boxShadow: "0 10px 30px rgba(15, 23, 42, 0.08)",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#2563eb",
        borderWidth: 1,
      },
    },
  };

  const searchInput = (
    <TextField
      size="small"
      placeholder="Search for posts..."
      sx={searchFieldStyles}
      onChange={handleChange}
      value={search}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <AiOutlineSearch color="#64748b" />
          </InputAdornment>
        ),
      }}
    />
  );

  return (
    <Stack
      mb={2}
      sx={{
        position: "sticky",
        top: 0,
        zIndex: 20,
        py: 1.5,
        backgroundColor: "rgba(247, 248, 251, 0.86)",
        backdropFilter: "blur(18px)",
        borderBottom: "1px solid rgba(15, 23, 42, 0.08)",
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        spacing={!mobile ? 2 : 1}
      >
        <Stack
          direction="row"
          alignItems="center"
          spacing={1.25}
          component={Link}
          to="/"
          sx={{
            minWidth: 0,
            color: "inherit",
            textDecoration: "none",
          }}
        >
          <Box
            component="img"
            src={devSpaceLogo}
            alt="DevSpace"
            sx={{
              width: 40,
              height: 40,
              flexShrink: 0,
              objectFit: "contain",
            }}
          />
          <Typography
            sx={{
              display: mobile ? "none" : "block",
              color: "#111827",
              fontWeight: 800,
              letterSpacing: 0,
            }}
            variant={navbarWidth ? "h6" : "h5"}
          >
            DevSpace
          </Typography>
        </Stack>

        {!navbarWidth && (
          <Box component="form" onSubmit={handleSubmit}>
            {searchInput}
          </Box>
        )}

        <Stack direction="row" alignItems="center" spacing={0.5}>
          {navbarWidth && (
            <Tooltip title="Search">
              <IconButton onClick={handleSearchIcon} sx={navIconStyles}>
                <AiOutlineSearch />
              </IconButton>
            </Tooltip>
          )}

          <Tooltip title="Home">
            <IconButton component={Link} to="/" sx={navIconStyles}>
              <AiFillHome />
            </IconButton>
          </Tooltip>
          {user ? (
            <>
              <Tooltip title="Messages">
                <IconButton component={Link} to="/messenger" sx={navIconStyles}>
                  <AiFillMessage />
                </IconButton>
              </Tooltip>
              <Tooltip title="Profile">
                <IconButton
                  component={Link}
                  to={"/users/" + username}
                  sx={{
                    width: 42,
                    height: 42,
                    border: "1px solid rgba(15, 23, 42, 0.1)",
                    "&:hover": {
                      backgroundColor: "#eff6ff",
                      borderColor: "rgba(37, 99, 235, 0.28)",
                    },
                  }}
                >
                  <UserAvatar width={30} height={30} username={user.username} />
                </IconButton>
              </Tooltip>
              <Button
                onClick={handleLogout}
                variant="outlined"
                sx={{
                  ml: mobile ? 0 : 0.75,
                  minWidth: mobile ? 0 : 82,
                  px: mobile ? 1.5 : 2.25,
                  height: 40,
                  color: "#111827",
                  borderColor: "rgba(15, 23, 42, 0.14)",
                  borderRadius: "8px",
                  fontWeight: 700,
                  textTransform: "none",
                  "&:hover": {
                    color: "#2563eb",
                    borderColor: "#2563eb",
                    backgroundColor: "#ffffff",
                  },
                }}
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button
                component={Link}
                to="/signup"
                variant="contained"
                sx={{
                  minWidth: mobile ? 72 : 88,
                  height: 40,
                  backgroundColor: "#111827",
                  borderRadius: "8px",
                  boxShadow: "none",
                  fontWeight: 700,
                  textTransform: "none",
                  "&:hover": {
                    backgroundColor: "#2563eb",
                    boxShadow: "none",
                  },
                }}
              >
                Sign Up
              </Button>
              <Button
                component={Link}
                to="/login"
                variant="text"
                sx={{
                  minWidth: mobile ? 62 : 72,
                  height: 40,
                  color: "#111827",
                  borderRadius: "8px",
                  fontWeight: 700,
                  textTransform: "none",
                  "&:hover": {
                    color: "#2563eb",
                    backgroundColor: "#eff6ff",
                  },
                }}
              >
                Login
              </Button>
            </>
          )}
        </Stack>
      </Stack>
      {navbarWidth && searchIcon && (
        <Box component="form" onSubmit={handleSubmit} mt={1.5}>
          {searchInput}
        </Box>
      )}
    </Stack>
  );
};

export default Navbar;
