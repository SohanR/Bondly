import badgeAuthor from "../assets/badges/badge-author.png";
import badgeBuilder from "../assets/badges/badge-builder.png";
import badgeCommunityBuilder from "../assets/badges/badge-community-builder.png";
import badgeDeveloper from "../assets/badges/badge-developer.png";
import badgeHelpfulVoice from "../assets/badges/badge-helpful-voice.png";
import badgeOpenSource from "../assets/badges/badge-open-source.png";
import badgePopularProject from "../assets/badges/badge-popular-project.png";
import badgeRisingSpace from "../assets/badges/badge-rising-space.png";
import badgeSpaceFounder from "../assets/badges/badge-space-founder.png";
import badgeStarter from "../assets/badges/badge-starter.png";
import badgeTrustedMember from "../assets/badges/badge-trusted-member.png";
import badgeVerifiedUser from "../assets/badges/badge-verified-user.png";

const BADGE_DEFINITIONS = [
  {
    key: "verified_user",
    name: "Verified User",
    description: "Verify your email address with an OTP.",
    icon: badgeVerifiedUser,
  },
  {
    key: "developer",
    name: "Developer",
    description: "Connect and verify your GitHub account.",
    icon: badgeDeveloper,
  },
  {
    key: "author",
    name: "Author",
    description: "Publish 10 posts.",
    icon: badgeAuthor,
  },
  {
    key: "helpful_voice",
    name: "Helpful Voice",
    description: "Receive 50 likes across your posts.",
    icon: badgeHelpfulVoice,
  },
  {
    key: "starter",
    name: "Starter",
    description: "Publish your first post.",
    icon: badgeStarter,
  },
  {
    key: "builder",
    name: "Builder",
    description: "Publish 25 posts.",
    icon: badgeBuilder,
  },
  {
    key: "trusted_member",
    name: "Trusted Member",
    description: "Verify your email and connect GitHub.",
    icon: badgeTrustedMember,
  },
  {
    key: "space_founder",
    name: "Space Founder",
    description: "Create your first Space.",
    icon: badgeSpaceFounder,
  },
  {
    key: "circle_admin",
    name: "Circle Admin",
    description: "Create your first Circle.",
    icon: badgeCommunityBuilder,
  },
  {
    key: "circle_contributor",
    name: "Circle Contributor",
    description: "Publish 5 approved posts in Circles.",
    icon: badgeHelpfulVoice,
  },
  {
    key: "community_builder",
    name: "Community Builder",
    description: "Gain 25 followers across your Spaces.",
    icon: badgeCommunityBuilder,
  },
  {
    key: "rising_space",
    name: "Rising Space",
    description: "Reach 100 impressions across your Spaces.",
    icon: badgeRisingSpace,
  },
  {
    key: "open_source",
    name: "Open Source",
    description: "Connect GitHub with at least one public repository.",
    icon: badgeOpenSource,
  },
  {
    key: "popular_project",
    name: "Popular Project",
    description: "Connect GitHub with a public repository that has stars.",
    icon: badgePopularProject,
  },
];

const BADGE_MAP = BADGE_DEFINITIONS.reduce((result, badge) => {
  result[badge.key] = badge;
  return result;
}, {});

export { BADGE_DEFINITIONS, BADGE_MAP };
