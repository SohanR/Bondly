import {
  Box,
  Button,
  Card,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import {
  MdClose,
  MdEditNote,
  MdMailOutline,
  MdSave,
} from "react-icons/md";
import { isLoggedIn } from "../helpers/authHelper";
import Loading from "./Loading";
import UserAvatar from "./UserAvatar";
import HorizontalStack from "./util/HorizontalStack";

const Profile = (props) => {
  const [user, setUser] = useState(null);
  const [bio, setBio] = useState("");
  const [bioError, setBioError] = useState("");
  const currentUser = isLoggedIn();

  useEffect(() => {
    if (props.profile) {
      setUser(props.profile.user);
      setBio(props.profile.user.biography || "");
      setBioError("");
    }
  }, [props.profile]);

  const handleBioChange = (e) => {
    const value = e.target.value;
    setBio(value);
    setBioError(props.validate ? props.validate(value) : "");
  };

  const handleBioSubmit = (e) => {
    e.preventDefault();
    const error = props.validate ? props.validate(bio) : "";
    setBioError(error);
    if (!error) {
      props.handleSubmit(e);
    }
  };

  const handleCancel = () => {
    setBio(user.biography || "");
    setBioError("");
    props.handleEditing();
  };

  return (
    <Card
      sx={{
        borderRadius: 3,
        p: 2.5,
        background:
          "linear-gradient(135deg, rgba(25, 118, 210, 0.08), rgba(15, 23, 42, 0.02))",
      }}
    >
      {user ? (
        <Stack alignItems="center" spacing={2}>
          <Box
            sx={{
              p: 0.75,
              borderRadius: "50%",
              backgroundColor: "background.paper",
              boxShadow: "0 18px 48px rgba(15, 23, 42, 0.14)",
            }}
          >
            <UserAvatar width={136} height={136} username={user.username} />
          </Box>

          <Box textAlign="center">
            <Typography variant="h5" sx={{ fontWeight: 900 }}>
              {user.username}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              DevSpace member
            </Typography>
          </Box>

          {props.editing ? (
            <Box component="form" onSubmit={handleBioSubmit} sx={{ width: "100%" }}>
              <Stack spacing={1.25}>
                <TextField
                  name="content"
                  value={bio}
                  onChange={handleBioChange}
                  multiline
                  minRows={3}
                  maxRows={6}
                  fullWidth
                  placeholder="Tell people a little about yourself..."
                  error={Boolean(bioError)}
                  helperText={bioError || `${250 - bio.length} characters remaining`}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 3,
                      backgroundColor: "background.paper",
                    },
                  }}
                />
                <HorizontalStack justifyContent="center">
                  <Button
                    type="submit"
                    variant="contained"
                    startIcon={<MdSave />}
                    sx={{
                      borderRadius: 999,
                      textTransform: "none",
                      fontWeight: 800,
                      boxShadow: "none",
                    }}
                  >
                    Update bio
                  </Button>
                  <Button
                    type="button"
                    variant="outlined"
                    startIcon={<MdClose />}
                    onClick={handleCancel}
                    sx={{
                      borderRadius: 999,
                      textTransform: "none",
                      fontWeight: 800,
                    }}
                  >
                    Cancel
                  </Button>
                </HorizontalStack>
              </Stack>
            </Box>
          ) : (
            <Box
              sx={{
                width: "100%",
                borderRadius: 3,
                p: 1.5,
                backgroundColor: "background.paper",
                border: "1px solid",
                borderColor: "divider",
                textAlign: "center",
              }}
            >
              <Typography color={user.biography ? "text.primary" : "text.secondary"}>
                {user.biography || "No bio yet"}
              </Typography>
            </Box>
          )}

          {currentUser && user._id === currentUser.userId && !props.editing && (
            <Button
              startIcon={<MdEditNote />}
              variant="outlined"
              onClick={props.handleEditing}
              sx={{
                borderRadius: 999,
                textTransform: "none",
                fontWeight: 800,
              }}
            >
              Edit bio
            </Button>
          )}

          {currentUser && user._id !== currentUser.userId && (
            <Button
              variant="contained"
              startIcon={<MdMailOutline />}
              onClick={props.handleMessage}
              sx={{
                borderRadius: 999,
                textTransform: "none",
                fontWeight: 800,
                boxShadow: "0 10px 24px rgba(25, 118, 210, 0.2)",
              }}
            >
              Message
            </Button>
          )}

          <HorizontalStack
            justifyContent="center"
            sx={{
              width: "100%",
              pt: 1,
              borderTop: "1px solid",
              borderColor: "divider",
            }}
          >
            <Stack alignItems="center" sx={{ flex: 1 }}>
              <Typography sx={{ fontWeight: 900 }}>
                {props.profile.posts.likeCount}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Likes
              </Typography>
            </Stack>
            <Stack alignItems="center" sx={{ flex: 1 }}>
              <Typography sx={{ fontWeight: 900 }}>
                {props.profile.posts.count}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Posts
              </Typography>
            </Stack>
          </HorizontalStack>
        </Stack>
      ) : (
        <Loading label="Loading profile" />
      )}
    </Card>
  );
};

export default Profile;
