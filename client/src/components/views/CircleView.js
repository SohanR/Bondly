import {
  Box,
  Button,
  Card,
  Chip,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  List,
  ListItem,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import {
  MdCheck,
  MdClose,
  MdEdit,
  MdGroupAdd,
  MdLockOutline,
  MdPersonRemove,
} from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";
import {
  approveCircleMember,
  approveCirclePost,
  getCircle,
  joinCircle,
  kickCircleMember,
  leaveCircle,
  rejectCircleMember,
  rejectCirclePost,
  updateCircle,
} from "../../api/circles";
import { getMediaUrl } from "../../helpers/mediaHelper";
import { isLoggedIn } from "../../helpers/authHelper";
import CircleForm from "../CircleForm";
import CirclePostComposer from "../CirclePostComposer";
import DiscoverRail from "../DiscoverRail";
import ErrorAlert from "../ErrorAlert";
import GridLayout from "../GridLayout";
import Loading from "../Loading";
import Navbar from "../Navbar";
import PostCard from "../PostCard";
import Sidebar from "../Sidebar";
import HorizontalStack from "../util/HorizontalStack";

const CircleView = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const user = isLoggedIn();
  const token = user && user.token;
  const [circle, setCircle] = useState(null);
  const [posts, setPosts] = useState([]);
  const [members, setMembers] = useState([]);
  const [pendingMembers, setPendingMembers] = useState([]);
  const [pendingPosts, setPendingPosts] = useState([]);
  const [canSeePrivateContent, setCanSeePrivateContent] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(false);
  const [membersOpen, setMembersOpen] = useState(false);

  const fetchCircle = useCallback(async () => {
    setLoading(true);
    const data = await getCircle(slug, token);
    if (data?.error) {
      setError(data.error);
    } else {
      setCircle(data.data);
      setPosts(Array.isArray(data.posts) ? data.posts : []);
      setMembers(Array.isArray(data.members) ? data.members : []);
      setPendingMembers(Array.isArray(data.pendingMembers) ? data.pendingMembers : []);
      setPendingPosts(Array.isArray(data.pendingPosts) ? data.pendingPosts : []);
      setCanSeePrivateContent(Boolean(data.canSeePrivateContent));
    }
    setLoading(false);
  }, [slug, token]);

  useEffect(() => {
    fetchCircle();
  }, [fetchCircle]);

  const isAdmin = Boolean(user && circle && user.userId === circle.owner);
  const isMember = Boolean(circle?.isMember || isAdmin);
  const canPost = Boolean(isMember && user?.emailVerified && user?.githubConnected);

  const handleJoin = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    const data =
      circle.viewerMembership === "approved" || circle.viewerMembership === "pending"
        ? await leaveCircle(user, circle._id)
        : await joinCircle(user, circle._id);

    if (data && !data.error) {
      await fetchCircle();
    }
  };

  const handleUpdate = async (formData) => {
    const data = await updateCircle(user, circle._id, formData);
    if (data?.data) {
      setCircle(data.data);
      setEditing(false);
      if (data.data.slug !== slug) navigate("/circles/" + data.data.slug);
    }
    return data;
  };

  const handleCreatedPost = (post) => {
    setPosts([post, ...posts]);
    setCircle({ ...circle, postCount: (circle.postCount || 0) + 1 });
  };

  const handleMemberModeration = async (memberId, approve) => {
    const data = approve
      ? await approveCircleMember(user, circle._id, memberId)
      : await rejectCircleMember(user, circle._id, memberId);
    if (data && !data.error) fetchCircle();
  };

  const handleKick = async (memberId) => {
    const data = await kickCircleMember(user, circle._id, memberId);
    if (data && !data.error) fetchCircle();
  };

  const handlePostModeration = async (postId, approve) => {
    const data = approve
      ? await approveCirclePost(user, circle._id, postId)
      : await rejectCirclePost(user, circle._id, postId);
    if (data && !data.error) fetchCircle();
  };

  const joinLabel =
    circle?.viewerMembership === "pending"
      ? "Cancel request"
      : circle?.viewerMembership === "approved"
      ? "Leave Circle"
      : circle?.joinApprovalRequired
      ? "Request to join"
      : "Join Circle";

  const content = () => {
    if (loading) return <Loading label="Loading Circle" />;
    if (error) return <ErrorAlert error={error} />;
    if (!circle) return null;

    return (
      <Stack spacing={2}>
        <Card sx={{ borderRadius: 3, overflow: "hidden", p: 0 }}>
          <Box
            component="img"
            src={getMediaUrl(circle.bannerImage)}
            alt=""
            sx={{ width: "100%", height: { xs: 180, sm: 260 }, objectFit: "cover" }}
          />
          <Box sx={{ p: { xs: 2, sm: 3 } }}>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              alignItems={{ xs: "flex-start", sm: "center" }}
              justifyContent="space-between"
            >
              <Box>
                <HorizontalStack sx={{ flexWrap: "wrap" }}>
                  <Typography variant="h4" sx={{ fontWeight: 900 }}>
                    {circle.name}
                  </Typography>
                  <Chip label={circle.stack} size="small" />
                  <Chip
                    label={circle.mode}
                    size="small"
                    color={circle.mode === "private" ? "warning" : "default"}
                  />
                </HorizontalStack>
                <Typography sx={{ mt: 1, lineHeight: 1.7 }}>{circle.description}</Typography>
              </Box>
              <HorizontalStack>
                {isAdmin ? (
                  <Button startIcon={<MdEdit />} onClick={() => setEditing(!editing)}>
                    Settings
                  </Button>
                ) : (
                  <Button
                    variant={circle.viewerMembership ? "outlined" : "contained"}
                    startIcon={
                      circle.viewerMembership ? <MdPersonRemove /> : <MdGroupAdd />
                    }
                    onClick={handleJoin}
                    sx={{ borderRadius: 999, fontWeight: 900 }}
                  >
                    {joinLabel}
                  </Button>
                )}
              </HorizontalStack>
            </Stack>

            <HorizontalStack sx={{ mt: 2, pt: 2, borderTop: "1px solid", borderColor: "divider" }}>
              <Stack alignItems="center" sx={{ flex: 1 }}>
                <Button onClick={() => setMembersOpen(true)} disabled={!canSeePrivateContent}>
                  <Stack alignItems="center">
                    <Typography sx={{ fontWeight: 900 }}>{circle.memberCount || 0}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      Members
                    </Typography>
                  </Stack>
                </Button>
              </Stack>
              <Stack alignItems="center" sx={{ flex: 1 }}>
                <Typography sx={{ fontWeight: 900 }}>{circle.postCount || 0}</Typography>
                <Typography variant="caption" color="text.secondary">
                  Posts
                </Typography>
              </Stack>
              <Stack alignItems="center" sx={{ flex: 1 }}>
                <Typography sx={{ fontWeight: 900 }}>{circle.helpfulCount || 0}</Typography>
                <Typography variant="caption" color="text.secondary">
                  Helpful
                </Typography>
              </Stack>
            </HorizontalStack>
          </Box>
        </Card>

        {editing && (
          <CircleForm
            initialCircle={circle}
            submitLabel="Save Circle"
            onSubmit={handleUpdate}
          />
        )}

        {isAdmin && (pendingMembers.length > 0 || pendingPosts.length > 0) && (
          <Card sx={{ borderRadius: 3, p: 2 }}>
            <Stack spacing={2}>
              <Typography variant="h6" sx={{ fontWeight: 900 }}>
                Pending Review
              </Typography>
              {pendingMembers.length > 0 && (
                <Box>
                  <Typography sx={{ fontWeight: 800 }}>Join requests</Typography>
                  <List dense>
                    {pendingMembers.map((member) => (
                      <ListItem
                        key={member._id}
                        secondaryAction={
                          <HorizontalStack>
                            <Button size="small" startIcon={<MdCheck />} onClick={() => handleMemberModeration(member._id, true)}>
                              Approve
                            </Button>
                            <Button size="small" color="error" startIcon={<MdClose />} onClick={() => handleMemberModeration(member._id, false)}>
                              Reject
                            </Button>
                          </HorizontalStack>
                        }
                      >
                        <ListItemText primary={member.userId?.username || "Unknown user"} />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              )}
              {pendingPosts.length > 0 && (
                <Box>
                  <Typography sx={{ fontWeight: 800 }}>Posts</Typography>
                  <Stack spacing={1.5}>
                    {pendingPosts.map((post) => (
                      <Card key={post._id} sx={{ p: 1.5, borderRadius: 2 }}>
                        <Stack spacing={1}>
                          <Typography sx={{ fontWeight: 900 }}>{post.title}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            @{post.poster?.username || "unknown"}
                          </Typography>
                          <HorizontalStack>
                            <Button size="small" startIcon={<MdCheck />} onClick={() => handlePostModeration(post._id, true)}>
                              Approve
                            </Button>
                            <Button size="small" color="error" startIcon={<MdClose />} onClick={() => handlePostModeration(post._id, false)}>
                              Reject
                            </Button>
                          </HorizontalStack>
                        </Stack>
                      </Card>
                    ))}
                  </Stack>
                </Box>
              )}
            </Stack>
          </Card>
        )}

        {canPost && <CirclePostComposer circle={circle} onCreated={handleCreatedPost} />}
        {isMember && !canPost && (
          <Card sx={{ borderRadius: 3, p: 2 }}>
            <Typography color="text.secondary">
              Verify your email and connect GitHub to create Circle posts.
            </Typography>
          </Card>
        )}
        {!canSeePrivateContent && (
          <Card sx={{ borderRadius: 3, p: 3, textAlign: "center" }}>
            <Stack alignItems="center" spacing={1}>
              <MdLockOutline size={28} />
              <Typography sx={{ fontWeight: 900 }}>Private Circle</Typography>
              <Typography color="text.secondary">
                Join this Circle to view discussions and members.
              </Typography>
            </Stack>
          </Card>
        )}
        {posts.map((post) => (
          <PostCard key={post._id} post={post} preview="primary" />
        ))}
        {canSeePrivateContent && !posts.length && (
          <Card sx={{ borderRadius: 3, p: 3, textAlign: "center" }}>
            <Typography color="text.secondary">No Circle posts yet</Typography>
          </Card>
        )}

        <Dialog open={membersOpen} onClose={() => setMembersOpen(false)} maxWidth="xs" fullWidth>
          <DialogTitle sx={{ fontWeight: 900 }}>Members</DialogTitle>
          <DialogContent>
            <List>
              {members.map((member) => (
                <ListItem
                  key={member._id}
                  secondaryAction={
                    isAdmin && user.userId !== member.userId?._id ? (
                      <Button color="error" size="small" onClick={() => handleKick(member._id)}>
                        Kick
                      </Button>
                    ) : null
                  }
                >
                  <ListItemText
                    primary={member.userId?.username || "Unknown user"}
                    secondary={member.userId?._id === circle.owner ? "Admin" : "Member"}
                  />
                </ListItem>
              ))}
            </List>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setMembersOpen(false)}>Close</Button>
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
        right={<Sidebar circle={circle?.slug} title="Top in this Circle" />}
      />
    </Container>
  );
};

export default CircleView;
