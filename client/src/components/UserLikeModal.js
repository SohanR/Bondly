import { Backdrop, Box, Card, Modal, Stack, Typography } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { getUserLikes } from "../api/posts";
import Loading from "./Loading";
import UserEntry from "./UserEntry";

const styles = {
  container: {
    position: "absolute",
    left: "50%",
    top: "50%",
    transform: "translate(-50%, -50%)",
    width: 440,
    maxWidth: "calc(100% - 32px)",
    maxHeight: "min(560px, calc(100vh - 64px))",
    overflowY: "auto",
    outline: "none",
  },
};

const UserLikeModal = ({ postId, open, setOpen }) => {
  const [userLikes, setUserLikes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMorePages, setHasMorePages] = useState(true);
  const scrollBoxRef = useRef(null);

  const handleClose = () => setOpen(false);
  const handleBackdropClick = (event) => {
    event.stopPropagation();
    setOpen(false);
  };

  const fetchUserLikes = async () => {
    if (loading || !hasMorePages) return;

    setLoading(true);

    let anchor = "";
    if (userLikes && userLikes.length > 0) {
      anchor = userLikes[userLikes.length - 1].id;
    }

    const data = await getUserLikes(postId, anchor);

    setLoading(false);
    if (data.success) {
      setUserLikes([...userLikes, ...data.userLikes]);
      setHasMorePages(data.hasMorePages);
    }
  };

  useEffect(() => {
    if (open) {
      fetchUserLikes();
    }
  }, [open]);

  const handleScroll = () => {
    const scrollBox = scrollBoxRef.current;

    if (
      scrollBox.scrollTop + scrollBox.clientHeight >
      scrollBox.scrollHeight - 12
    ) {
      fetchUserLikes();
    }
  };

  useEffect(() => {
    if (!scrollBoxRef.current) {
      return;
    }
    const scrollBox = scrollBoxRef.current;
    scrollBox.addEventListener("scroll", handleScroll);

    return () => {
      scrollBox.removeEventListener("scroll", handleScroll);
    };
  }, [userLikes]);

  return (
    <Modal
      open={open}
      onClose={handleClose}
      BackdropComponent={Backdrop}
      BackdropProps={{ onClick: handleBackdropClick }}
    >
      <Box
        sx={styles.container}
        ref={scrollBoxRef}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <Card
          sx={{
            borderRadius: 4,
            p: 2.5,
            boxShadow: "0 24px 80px rgba(15, 23, 42, 0.22)",
          }}
        >
          <Box
            sx={{
              position: "sticky",
              top: 0,
              backgroundColor: "background.paper",
              pb: 1.5,
              zIndex: 1,
            }}
          >
            <Typography variant="h5" sx={{ fontWeight: 800 }}>
              Liked by
            </Typography>
            <Typography variant="body2" color="text.secondary">
              People who reacted to this post
            </Typography>
          </Box>
          <Stack>
            <Stack spacing={1.25}>
              {userLikes &&
                userLikes.map((like) => (
                  <UserEntry username={like.username} key={like.username} />
                ))}
            </Stack>
            {loading ? <Loading /> : hasMorePages && <Box py={6}></Box>}
          </Stack>
        </Card>
      </Box>
    </Modal>
  );
};

export default UserLikeModal;
