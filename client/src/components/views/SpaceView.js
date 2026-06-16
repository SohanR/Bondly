import {
  Avatar,
  Box,
  Button,
  Card,
  Chip,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
} from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import { MdEdit, MdLink, MdPersonAdd, MdPersonRemove } from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";
import {
  followSpace,
  getSpace,
  unfollowSpace,
  unpublishSpace,
  updateSpace,
} from "../../api/spaces";
import { getMediaUrl } from "../../helpers/mediaHelper";
import { isLoggedIn } from "../../helpers/authHelper";
import DiscoverRail from "../DiscoverRail";
import ErrorAlert from "../ErrorAlert";
import GridLayout from "../GridLayout";
import Loading from "../Loading";
import Navbar from "../Navbar";
import PostCard from "../PostCard";
import Sidebar from "../Sidebar";
import SpaceForm from "../SpaceForm";
import SpacePostComposer from "../SpacePostComposer";
import HorizontalStack from "../util/HorizontalStack";

const SpaceView = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const user = isLoggedIn();
  const token = user && user.token;
  const [space, setSpace] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(false);
  const [unpublishOpen, setUnpublishOpen] = useState(false);

  const fetchSpace = useCallback(async () => {
    setLoading(true);
    const data = await getSpace(slug, token);
    if (data?.error) {
      setError(data.error);
    } else {
      setSpace(data.data);
      setPosts(Array.isArray(data.posts) ? data.posts : []);
    }
    setLoading(false);
  }, [slug, token]);

  useEffect(() => {
    fetchSpace();
  }, [fetchSpace]);

  const isOwner = user && space && user.userId === space.owner;

  const handleFollow = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    const data = space.followed
      ? await unfollowSpace(user, space._id)
      : await followSpace(user, space._id);

    if (data && !data.error) {
      setSpace({
        ...space,
        followed: !space.followed,
        followerCount: data.followerCount,
      });
    }
  };

  const handleUpdate = async (formData) => {
    const data = await updateSpace(user, space._id, formData);
    if (data?.data) {
      setSpace(data.data);
      setEditing(false);
      if (data.data.slug !== slug) navigate("/spaces/" + data.data.slug);
    }
    return data;
  };

  const handleUnpublish = async () => {
    const data = await unpublishSpace(user, space._id);
    if (data && !data.error) navigate("/users/" + user.username);
  };

  const handleCreatedPost = (post) => {
    setPosts([post, ...posts]);
    setSpace({ ...space, postCount: (space.postCount || 0) + 1 });
  };

  const content = () => {
    if (loading) return <Loading label="Loading space" />;
    if (error) return <ErrorAlert error={error} />;
    if (!space) return null;

    return (
      <Stack spacing={2}>
        <Card sx={{ borderRadius: 3, overflow: "hidden", p: 0 }}>
          <Box
            component="img"
            src={getMediaUrl(space.bannerImage)}
            alt=""
            sx={{ width: "100%", height: { xs: 180, sm: 260 }, objectFit: "cover" }}
          />
          <Box sx={{ p: { xs: 2, sm: 3 }, pt: 0 }}>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              alignItems={{ xs: "flex-start", sm: "flex-end" }}
              justifyContent="space-between"
            >
              <HorizontalStack spacing={2} sx={{ mt: -5 }}>
                <Avatar
                  src={getMediaUrl(space.avatarImage)}
                  sx={{
                    width: 104,
                    height: 104,
                    border: "4px solid white",
                    boxShadow: "0 16px 38px rgba(15,23,42,0.18)",
                  }}
                />
                <Box sx={{ pt: 5 }}>
                  <Typography variant="h4" sx={{ fontWeight: 900 }}>
                    {space.name}
                  </Typography>
                  <Chip label={space.specialization} size="small" />
                </Box>
              </HorizontalStack>
              <HorizontalStack>
                {isOwner ? (
                  <Button startIcon={<MdEdit />} onClick={() => setEditing(!editing)}>
                    Settings
                  </Button>
                ) : (
                  <Button
                    variant={space.followed ? "outlined" : "contained"}
                    startIcon={space.followed ? <MdPersonRemove /> : <MdPersonAdd />}
                    onClick={handleFollow}
                    sx={{ borderRadius: 999, fontWeight: 900 }}
                  >
                    {space.followed ? "Unfollow" : "Follow"}
                  </Button>
                )}
              </HorizontalStack>
            </Stack>

            <Typography sx={{ mt: 2, lineHeight: 1.7 }}>{space.about}</Typography>
            {space.links?.length > 0 && (
              <HorizontalStack sx={{ mt: 2, flexWrap: "wrap" }}>
                {space.links.map((link) => (
                  <Button
                    key={`${link.type}-${link.url}`}
                    component="a"
                    href={link.url}
                    target="_blank"
                    rel="noreferrer"
                    startIcon={<MdLink />}
                    size="small"
                  >
                    {link.type}
                  </Button>
                ))}
              </HorizontalStack>
            )}

            <HorizontalStack sx={{ mt: 2, pt: 2, borderTop: "1px solid", borderColor: "divider" }}>
              {[
                ["Followers", space.followerCount],
                ["Posts", space.postCount],
                ["Votes", space.voteCount],
                ["Impressions", space.impressionCount],
              ].map(([label, value]) => (
                <Stack alignItems="center" sx={{ flex: 1 }} key={label}>
                  <Typography sx={{ fontWeight: 900 }}>{value || 0}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {label}
                  </Typography>
                </Stack>
              ))}
            </HorizontalStack>
          </Box>
        </Card>

        {editing && (
          <SpaceForm
            initialSpace={space}
            submitLabel="Save Space"
            onSubmit={handleUpdate}
            onUnpublish={() => setUnpublishOpen(true)}
          />
        )}
        {isOwner && <SpacePostComposer space={space} onCreated={handleCreatedPost} />}
        {posts.map((post) => (
          <PostCard key={post._id} post={post} preview="primary" />
        ))}
        {!posts.length && (
          <Card sx={{ borderRadius: 3, p: 3, textAlign: "center" }}>
            <Typography color="text.secondary">No Space posts yet</Typography>
          </Card>
        )}
        <Dialog open={unpublishOpen} onClose={() => setUnpublishOpen(false)} maxWidth="xs" fullWidth>
          <DialogTitle sx={{ fontWeight: 900 }}>Unpublish Space?</DialogTitle>
          <DialogContent>
            <Typography color="text.secondary" sx={{ lineHeight: 1.7 }}>
              This Space will be hidden from public pages, search, top spaces,
              and feeds. You can still see it from your profile.
            </Typography>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={() => setUnpublishOpen(false)}>Cancel</Button>
            <Button color="error" variant="contained" onClick={handleUnpublish}>
              Unpublish
            </Button>
          </DialogActions>
        </Dialog>
      </Stack>
    );
  };

  return (
    <Container>
      <Navbar />
      <GridLayout
        leftRail={<DiscoverRail />}
        left={content()}
        right={<Sidebar space={space?.slug} title="Top in this Space" />}
      />
    </Container>
  );
};

export default SpaceView;
