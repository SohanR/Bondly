import {
  Box,
  Button,
  Card,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { MdInfoOutline } from "react-icons/md";
import {
  confirmEmailVerificationOtp,
  getGithubConnectUrl,
  sendEmailVerificationOtp,
  updateShowcaseBadges,
} from "../api/users";
import { BADGE_DEFINITIONS } from "../constants/badges";
import { isLoggedIn } from "../helpers/authHelper";
import ErrorAlert from "./ErrorAlert";
import UserBadges from "./UserBadges";

const BadgesPanel = ({ profile, onProfileChange }) => {
  const currentUser = isLoggedIn();
  const isOwner = currentUser && currentUser.userId === profile.user._id;
  const earnedBadges = profile.badges?.earnedBadges || {};
  const [showcase, setShowcase] = useState(profile.badges?.showcaseBadges || []);
  const [infoBadge, setInfoBadge] = useState(null);
  const [otpOpen, setOtpOpen] = useState(false);
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleToggleShowcase = async (badgeKey) => {
    if (!isOwner || !earnedBadges[badgeKey]) return;

    const next = showcase.includes(badgeKey)
      ? showcase.filter((key) => key !== badgeKey)
      : [...showcase, badgeKey].slice(0, 3);

    const data = await updateShowcaseBadges(currentUser, next);
    if (data?.error) {
      setError(data.error);
      return;
    }

    setShowcase(data.showcaseBadges);
    onProfileChange({
      ...profile,
      badges: {
        ...profile.badges,
        showcaseBadges: data.showcaseBadges,
      },
      user: {
        ...profile.user,
        showcaseBadges: data.showcaseBadges,
      },
    });
  };

  const handleSendOtp = async () => {
    setError("");
    const data = await sendEmailVerificationOtp(currentUser);
    if (data?.error) {
      setError(data.error);
      return;
    }
    setMessage(
      data.devFallback
        ? "OTP generated. Check the server console because SMTP is not configured."
        : "OTP sent to your email."
    );
    setOtpOpen(true);
  };

  const handleConfirmOtp = async () => {
    setError("");
    const data = await confirmEmailVerificationOtp(currentUser, otp);
    if (data?.error) {
      setError(data.error);
      return;
    }
    window.location.reload();
  };

  const handleGithubConnect = () => {
    window.location.href = getGithubConnectUrl(currentUser);
  };

  return (
    <Card sx={{ borderRadius: 3, p: 2 }}>
      <Stack spacing={1.5}>
        <Box>
          <Typography sx={{ fontWeight: 900 }}>Badges</Typography>
          <Typography variant="caption" color="text.secondary">
            Showcase up to 3 badges beside your username.
          </Typography>
        </Box>

        <ErrorAlert error={error} />
        {message && (
          <Typography variant="body2" color="primary.main" sx={{ fontWeight: 700 }}>
            {message}
          </Typography>
        )}

        <Stack spacing={1}>
          {BADGE_DEFINITIONS.map((badge) => {
            const earned = Boolean(earnedBadges[badge.key]);
            const selected = showcase.includes(badge.key);

            return (
              <Box
                key={badge.key}
                sx={{
                  display: "grid",
                  gridTemplateColumns: "32px minmax(0, 1fr) auto",
                  alignItems: "center",
                  gap: 1,
                  p: 1,
                  borderRadius: 2,
                  border: "1px solid",
                  borderColor: "divider",
                  backgroundColor: earned ? "background.paper" : "grey.50",
                }}
              >
                <UserBadges badges={[badge.key]} locked={!earned} size={28} />
                <Box sx={{ minWidth: 0 }}>
                  <Typography sx={{ fontWeight: 900 }}>{badge.name}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {earned ? "Earned" : "Locked"}
                  </Typography>
                </Box>
                <Stack direction="row" alignItems="center" spacing={0.5}>
                  {isOwner && earned && (
                    <Tooltip title="Show beside username">
                      <Checkbox
                        size="small"
                        checked={selected}
                        onChange={() => handleToggleShowcase(badge.key)}
                      />
                    </Tooltip>
                  )}
                  {isOwner && badge.key === "verified_user" && !earned && (
                    <Button size="small" onClick={handleSendOtp}>
                      Verify
                    </Button>
                  )}
                  {isOwner && badge.key === "developer" && !earned && (
                    <Button size="small" onClick={handleGithubConnect}>
                      GitHub
                    </Button>
                  )}
                  <IconButton size="small" onClick={() => setInfoBadge(badge)}>
                    <MdInfoOutline />
                  </IconButton>
                </Stack>
              </Box>
            );
          })}
        </Stack>
      </Stack>

      <Dialog open={Boolean(infoBadge)} onClose={() => setInfoBadge(null)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 900 }}>{infoBadge?.name}</DialogTitle>
        <DialogContent>
          <Typography color="text.secondary">{infoBadge?.description}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setInfoBadge(null)}>Close</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={otpOpen} onClose={() => setOtpOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 900 }}>Enter email OTP</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ pt: 1 }}>
            <Typography color="text.secondary">
              Enter the 6 digit code sent to your email.
            </Typography>
            <TextField
              label="OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              inputProps={{ maxLength: 6 }}
              fullWidth
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOtpOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleConfirmOtp}>
            Verify email
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default BadgesPanel;
