const BADGES = [
  {
    key: "verified_user",
    name: "Verified User",
    description: "Verify your email address with an OTP.",
  },
  {
    key: "developer",
    name: "Developer",
    description: "Connect and verify your GitHub account.",
  },
  {
    key: "author",
    name: "Author",
    description: "Publish 10 posts.",
  },
  {
    key: "helpful_voice",
    name: "Helpful Voice",
    description: "Receive 50 likes across your posts.",
  },
  {
    key: "starter",
    name: "Starter",
    description: "Publish your first post.",
  },
  {
    key: "builder",
    name: "Builder",
    description: "Publish 25 posts.",
  },
  {
    key: "trusted_member",
    name: "Trusted Member",
    description: "Verify your email and connect GitHub.",
  },
  {
    key: "space_founder",
    name: "Space Founder",
    description: "Create your first Space.",
  },
  {
    key: "circle_admin",
    name: "Circle Admin",
    description: "Create your first Circle.",
  },
  {
    key: "circle_contributor",
    name: "Circle Contributor",
    description: "Publish 5 approved posts in Circles.",
  },
  {
    key: "community_builder",
    name: "Community Builder",
    description: "Gain 25 followers across your Spaces.",
  },
  {
    key: "rising_space",
    name: "Rising Space",
    description: "Reach 100 impressions across your Spaces.",
  },
  {
    key: "open_source",
    name: "Open Source",
    description: "Connect GitHub with at least one public repository.",
  },
  {
    key: "popular_project",
    name: "Popular Project",
    description: "Connect GitHub with a public repository that has stars.",
  },
];

const BADGE_KEYS = BADGES.map((badge) => badge.key);

const buildEarnedBadges = ({
  user,
  postCount,
  likeCount,
  spaces,
  circles = [],
  circlePostCount = 0,
}) => {
  const spaceCount = spaces.length;
  const circleCount = circles.length;
  const spaceFollowerCount = spaces.reduce(
    (sum, space) => sum + (space.followerCount || 0),
    0
  );
  const spaceImpressionCount = spaces.reduce(
    (sum, space) => sum + (space.impressionCount || 0),
    0
  );

  return {
    verified_user: Boolean(user.emailVerified),
    developer: Boolean(user.githubConnected),
    author: postCount >= 10,
    helpful_voice: likeCount >= 50,
    starter: postCount >= 1,
    builder: postCount >= 25,
    trusted_member: Boolean(user.emailVerified && user.githubConnected),
    space_founder: spaceCount >= 1,
    circle_admin: circleCount >= 1,
    circle_contributor: circlePostCount >= 5,
    community_builder: spaceFollowerCount >= 25,
    rising_space: spaceImpressionCount >= 100,
    open_source: Boolean(user.githubConnected && user.githubPublicRepos > 0),
    popular_project: Boolean(user.githubConnected && user.githubTotalStars > 0),
  };
};

const sanitizeShowcaseBadges = (showcaseBadges, earnedBadges) => {
  const seen = new Set();
  return (showcaseBadges || [])
    .filter((key) => BADGE_KEYS.includes(key) && earnedBadges[key] && !seen.has(key))
    .map((key) => {
      seen.add(key);
      return key;
    })
    .slice(0, 3);
};

module.exports = {
  BADGES,
  BADGE_KEYS,
  buildEarnedBadges,
  sanitizeShowcaseBadges,
};
