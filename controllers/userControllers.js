const User = require("../models/User");
const Post = require("../models/Post");
const PostLike = require("../models/PostLike");
const Space = require("../models/Space");
const Circle = require("../models/Circle");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Follow = require("../models/Follow");
const { default: mongoose } = require("mongoose");
const { sendOtpEmail } = require("../util/mailer");
const {
  BADGES,
  buildEarnedBadges,
  sanitizeShowcaseBadges,
} = require("../util/badges");

const getUserDict = (token, user) => {
  return {
    token,
    username: user.username,
    userId: user._id,
    isAdmin: user.isAdmin,
    emailVerified: user.emailVerified,
    githubConnected: user.githubConnected,
    showcaseBadges: user.showcaseBadges || [],
  };
};

const buildToken = (user) => {
  return {
    userId: user._id,
    isAdmin: user.isAdmin,
  };
};

const escapeRegex = (value) => {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

const buildUserSearchCondition = (search) => {
  if (typeof search !== "string") return {};

  const searchTerms = search
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map(escapeRegex);

  if (searchTerms.length === 0) return {};

  const searchRegex = {
    $regex: searchTerms.join("|"),
    $options: "i",
  };

  return {
    $or: [{ username: searchRegex }, { name: searchRegex }],
  };
};

const addBadgeData = (user, posts, spaces, circles, circlePostCount) => {
  const likeCount = posts.reduce((sum, post) => sum + (post.likeCount || 0), 0);
  const earnedBadges = buildEarnedBadges({
    user,
    postCount: posts.length,
    likeCount,
    spaces,
    circles,
    circlePostCount,
  });
  const earnedCount = Object.values(earnedBadges).filter(Boolean).length;
  const showcaseBadges = sanitizeShowcaseBadges(
    user.showcaseBadges || [],
    earnedBadges
  );

  return {
    earnedBadges,
    earnedCount,
    canCreateSpace:
      earnedBadges.verified_user && earnedBadges.developer && earnedCount >= 3,
    showcaseBadges,
    definitions: BADGES,
  };
};

const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!(username && email && password)) {
      throw new Error("All input required");
    }

    const normalizedEmail = email.toLowerCase();

    const hashedPassword = await bcrypt.hash(password, 10);

    const existingUser = await User.findOne({
      $or: [{ email: normalizedEmail }, { username }],
    });

    if (existingUser) {
      throw new Error("Email and username must be unique");
    }

    const user = await User.create({
      username,
      email: normalizedEmail,
      password: hashedPassword,
    });

    const token = jwt.sign(buildToken(user), process.env.TOKEN_KEY);

    return res.json(getUserDict(token, user));
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!(email && password)) {
      throw new Error("All input required");
    }

    const normalizedEmail = email.toLowerCase();

    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      throw new Error("Email or password incorrect");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new Error("Email or password incorrect");
    }

    const token = jwt.sign(buildToken(user), process.env.TOKEN_KEY);

    return res.json(getUserDict(token, user));
  } catch (err) {
    console.log(err);
    return res.status(400).json({ error: err.message });
  }
};

const follow = async (req, res) => {
  try {
    const { userId } = req.body;
    const followingId = req.params.id;

    const existingFollow = await Follow.find({ userId, followingId });

    if (existingFollow) {
      throw new Error("Already following this user");
    }

    const follow = await Follow.create({ userId, followingId });

    return res.status(200).json({ data: follow });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const { userId, biography } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      throw new Error("User does not exist");
    }

    if (typeof biography == "string") {
      user.biography = biography;
    }

    await user.save();

    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

const sendEmailVerificationOtp = async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await User.findById(userId).select(
      "+emailVerificationOtpHash +emailVerificationOtpExpiresAt +emailVerificationOtpAttempts"
    );

    if (!user) {
      throw new Error("User does not exist");
    }

    if (user.emailVerified) {
      return res.status(200).json({ success: true, alreadyVerified: true });
    }

    if (
      user.emailVerificationLastSentAt &&
      Date.now() - user.emailVerificationLastSentAt.getTime() < 60 * 1000
    ) {
      throw new Error("Please wait before requesting another OTP");
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.emailVerificationOtpHash = await bcrypt.hash(otp, 10);
    user.emailVerificationOtpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
    user.emailVerificationOtpAttempts = 0;
    user.emailVerificationLastSentAt = new Date();
    await user.save();

    const mailResult = await sendOtpEmail({
      to: user.email,
      username: user.username,
      otp,
    });

    return res.status(200).json({ success: true, ...mailResult });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

const confirmEmailVerificationOtp = async (req, res) => {
  try {
    const { userId, otp } = req.body;
    const user = await User.findById(userId).select(
      "+emailVerificationOtpHash +emailVerificationOtpExpiresAt +emailVerificationOtpAttempts"
    );

    if (!user) {
      throw new Error("User does not exist");
    }

    if (user.emailVerified) {
      return res.status(200).json({ success: true, emailVerified: true });
    }

    if (!user.emailVerificationOtpHash || !user.emailVerificationOtpExpiresAt) {
      throw new Error("Request an OTP first");
    }

    if (user.emailVerificationOtpExpiresAt.getTime() < Date.now()) {
      throw new Error("OTP expired");
    }

    if (user.emailVerificationOtpAttempts >= 5) {
      throw new Error("Too many failed attempts. Request a new OTP");
    }

    const valid = await bcrypt.compare(String(otp || ""), user.emailVerificationOtpHash);

    if (!valid) {
      user.emailVerificationOtpAttempts += 1;
      await user.save();
      throw new Error("Invalid OTP");
    }

    user.emailVerified = true;
    user.emailVerifiedAt = new Date();
    user.emailVerificationOtpHash = undefined;
    user.emailVerificationOtpExpiresAt = undefined;
    user.emailVerificationOtpAttempts = 0;
    await user.save();

    return res.status(200).json({ success: true, emailVerified: true });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

const githubConnect = async (req, res) => {
  try {
    const token = req.query.token;
    const { userId } = jwt.verify(token, process.env.TOKEN_KEY);

    if (!process.env.GITHUB_CLIENT_ID || !process.env.GITHUB_CLIENT_SECRET) {
      throw new Error("GitHub OAuth is not configured");
    }

    const state = jwt.sign({ userId }, process.env.TOKEN_KEY, {
      expiresIn: "10m",
    });
    const params = new URLSearchParams({
      client_id: process.env.GITHUB_CLIENT_ID,
      redirect_uri:
        process.env.GITHUB_CALLBACK_URL ||
        `${req.protocol}://${req.get("host")}/api/users/github/callback`,
      scope: "read:user public_repo",
      state,
    });

    return res.redirect(`https://github.com/login/oauth/authorize?${params}`);
  } catch (err) {
    return res.status(400).send(err.message);
  }
};

const githubCallback = async (req, res) => {
  try {
    const { code, state } = req.query;
    const { userId } = jwt.verify(state, process.env.TOKEN_KEY);

    const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
        redirect_uri:
          process.env.GITHUB_CALLBACK_URL ||
          `${req.protocol}://${req.get("host")}/api/users/github/callback`,
      }),
    });
    const tokenData = await tokenRes.json();

    if (!tokenData.access_token) {
      throw new Error("GitHub connection failed");
    }

    const githubUserRes = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
        Accept: "application/vnd.github+json",
      },
    });
    const githubUser = await githubUserRes.json();

    const reposRes = await fetch("https://api.github.com/user/repos?per_page=100", {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
        Accept: "application/vnd.github+json",
      },
    });
    const repos = await reposRes.json();
    const publicRepos = Array.isArray(repos)
      ? repos.filter((repo) => !repo.private)
      : [];
    const totalStars = publicRepos.reduce(
      (sum, repo) => sum + (repo.stargazers_count || 0),
      0
    );

    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User does not exist");
    }

    user.githubConnected = true;
    user.githubId = String(githubUser.id);
    user.githubUsername = githubUser.login;
    user.githubConnectedAt = new Date();
    user.githubPublicRepos = publicRepos.length;
    user.githubTotalStars = totalStars;
    await user.save();

    const clientUrl = process.env.CLIENT_URL || "http://localhost:3000";
    return res.redirect(`${clientUrl}/users/${user.username}?github=connected`);
  } catch (err) {
    const clientUrl = process.env.CLIENT_URL || "http://localhost:3000";
    return res.redirect(`${clientUrl}/?github=failed`);
  }
};

const updateShowcaseBadges = async (req, res) => {
  try {
    const { userId, badges } = req.body;
    const user = await User.findById(userId);

    if (!user) {
      throw new Error("User does not exist");
    }

    if (!Array.isArray(badges)) {
      throw new Error("Badges must be an array");
    }

    const posts = await Post.find({
      poster: user._id,
      postType: "user",
    });
    const spaces = await Space.find({ owner: user._id });
    const circles = await Circle.find({ owner: user._id });
    const circlePostCount = await Post.countDocuments({
      poster: user._id,
      postType: "circle",
      status: "approved",
    });
    const likeCount = posts.reduce((sum, post) => sum + (post.likeCount || 0), 0);
    const earnedBadges = buildEarnedBadges({
      user,
      postCount: posts.length,
      likeCount,
      spaces,
      circles,
      circlePostCount,
    });

    user.showcaseBadges = sanitizeShowcaseBadges(badges, earnedBadges);
    await user.save();

    return res.status(200).json({
      success: true,
      showcaseBadges: user.showcaseBadges,
    });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

const getUserBadgeState = async (user) => {
  const posts = await Post.find({
    poster: user._id,
    postType: "user",
  });
  const spaces = await Space.find({ owner: user._id });
  const circles = await Circle.find({ owner: user._id });
  const circlePostCount = await Post.countDocuments({
    poster: user._id,
    postType: "circle",
    status: "approved",
  });
  const likeCount = posts.reduce((sum, post) => sum + (post.likeCount || 0), 0);
  const earnedBadges = buildEarnedBadges({
    user,
    postCount: posts.length,
    likeCount,
    spaces,
    circles,
    circlePostCount,
  });
  const earnedCount = Object.values(earnedBadges).filter(Boolean).length;
  const canCreateSpace =
    earnedBadges.verified_user && earnedBadges.developer && earnedCount >= 3;

  return {
    earnedBadges,
    earnedCount,
    canCreateSpace,
  };
};

const unfollow = async (req, res) => {
  try {
    const { userId } = req.body;
    const followingId = req.params.id;

    const existingFollow = await Follow.find({ userId, followingId });

    if (!existingFollow) {
      throw new Error("Not already following user");
    }

    await existingFollow.remove();

    return res.status(200).json({ data: existingFollow });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

const getFollowers = async (req, res) => {
  try {
    const userId = req.params.id;

    const followers = await Follow.find({ followingId: userId });

    return res.status(200).json({ data: followers });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

const getFollowing = async (req, res) => {
  try {
    const userId = req.params.id;

    const following = await Follow.find({ userId });

    return res.status(200).json({ data: following });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

const getUser = async (req, res) => {
  try {
    const username = req.params.username;

    const user = await User.findOne({ username }).select("-password");

    if (!user) {
      throw new Error("User does not exist");
    }

    const posts = await Post.find({ poster: user._id, postType: "user" })
      .populate("poster")
      .populate("tags")
      .sort("-createdAt");

    let likeCount = 0;

    posts.forEach((post) => {
      likeCount += post.likeCount;
    });

    const data = {
      user,
      posts: {
        count: posts.length,
        likeCount,
        data: posts,
      },
      spaces: await Space.find({ owner: user._id }).sort("-createdAt"),
      circles: await Circle.find({ owner: user._id }).sort("-createdAt"),
    };
    const circlePostCount = await Post.countDocuments({
      poster: user._id,
      postType: "circle",
      status: "approved",
    });
    data.badges = addBadgeData(
      user,
      posts,
      data.spaces,
      data.circles,
      circlePostCount
    );
    data.user = {
      ...user.toObject(),
      showcaseBadges: data.badges.showcaseBadges,
      earnedBadges: data.badges.earnedBadges,
    };

    return res.status(200).json(data);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

const getRandomUsers = async (req, res) => {
  try {
    let { size, page, search } = req.query;
    size = Number(size) || 5;
    page = Number(page) || 1;

    const searchCondition = buildUserSearchCondition(search);

    if (search && search.trim()) {
      const count = await User.countDocuments(searchCondition);
      const users = await User.find(searchCondition)
        .select("-password")
        .sort("username")
        .skip((page - 1) * size)
        .limit(size);

      return res.status(200).json({
        data: users,
        count,
        page,
        hasMore: page * size < count,
      });
    }

    const users = await User.find().select("-password");

    if (size > users.length) {
      size = users.length;
    }

    const randomUsers = [];
    const randomIndices = getRandomIndices(size, users.length);

    for (let i = 0; i < randomIndices.length; i++) {
      const randomUser = users[randomIndices[i]];
      randomUsers.push(randomUser);
    }

    return res.status(200).json(randomUsers);
  } catch (err) {
    console.log(err);
    return res.status(400).json({ error: err.message });
  }
};

const getRandomIndices = (size, sourceSize) => {
  if (size <= 0 || sourceSize <= 0) return [];

  const randomIndices = [];
  while (randomIndices.length < size) {
    const randomNumber = Math.floor(Math.random() * sourceSize);
    if (!randomIndices.includes(randomNumber)) {
      randomIndices.push(randomNumber);
    }
  }
  return randomIndices;
};

module.exports = {
  register,
  login,
  follow,
  unfollow,
  getFollowers,
  getFollowing,
  getUser,
  getRandomUsers,
  updateUser,
  sendEmailVerificationOtp,
  confirmEmailVerificationOtp,
  githubConnect,
  githubCallback,
  updateShowcaseBadges,
  getUserBadgeState,
};
