const mongoose = require("mongoose");
const Circle = require("../models/Circle");
const CircleMember = require("../models/CircleMember");
const CirclePostHelpful = require("../models/CirclePostHelpful");
const Post = require("../models/Post");
const User = require("../models/User");
const Comment = require("../models/Comment");
const { extractHashtags, setPostTags } = require("../util/tags");
const { getUserBadgeState } = require("./userControllers");

const buildSlug = (name) => {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

const parseBoolean = (value) => value === true || value === "true";

const getUploadPath = (req, fieldName, fallback) => {
  const file = req.files && req.files[fieldName] && req.files[fieldName][0];
  if (!file) return fallback;
  return `/uploads/circles/${file.filename}`;
};

const requireCircleAdmin = (circle, userId, isAdmin) => {
  if (!circle.owner.equals(userId) && !isAdmin) {
    throw new Error("Not authorized to manage this Circle");
  }
};

const getMembership = async (circleId, userId) => {
  if (!userId) return null;
  return CircleMember.findOne({ circleId, userId });
};

const isApprovedMember = (membership) => membership?.status === "approved";

const refreshCircleCounts = async (circle) => {
  circle.memberCount = await CircleMember.countDocuments({
    circleId: circle._id,
    status: "approved",
  });
  circle.postCount = await Post.countDocuments({
    circle: circle._id,
    postType: "circle",
    status: "approved",
  });

  const totals = await Post.aggregate([
    {
      $match: {
        circle: circle._id,
        postType: "circle",
        status: "approved",
      },
    },
    {
      $group: {
        _id: "$circle",
        helpfulCount: { $sum: "$helpfulCount" },
      },
    },
  ]);

  circle.helpfulCount = totals[0]?.helpfulCount || 0;
  await circle.save();
};

const enrichCircleForViewer = async (circle, userId) => {
  const data = circle.toObject ? circle.toObject() : { ...circle };
  const membership = await getMembership(data._id, userId);

  data.viewerMembership = membership?.status || null;
  data.isMember = isApprovedMember(membership);
  data.isAdmin = Boolean(userId && String(data.owner) === String(userId));

  return data;
};

const addViewerHelpful = async (posts, userId) => {
  if (!userId || !posts.length) return;

  const helpfuls = await CirclePostHelpful.find({
    postId: { $in: posts.map((post) => post._id) },
    userId,
  });

  posts.forEach((post) => {
    post.viewerHelpful = helpfuls.some((item) => item.postId.equals(post._id));
  });
};

const createCircle = async (req, res) => {
  try {
    const { userId } = req.body;
    const {
      name,
      description,
      stack,
      mode,
      joinApprovalRequired,
      postApprovalRequired,
      policyAccepted,
    } = req.body;

    if (!(name && description && stack && mode)) {
      throw new Error("Name, description, stack, and mode are required");
    }

    if (!["public", "private"].includes(mode)) {
      throw new Error("Circle mode must be public or private");
    }

    if (!parseBoolean(policyAccepted)) {
      throw new Error("Circle policy agreement is required");
    }

    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User does not exist");
    }

    const badgeState = await getUserBadgeState(user);
    if (!badgeState.canCreateSpace) {
      throw new Error(
        "You need Verified User, Developer, and at least one more badge to create a Circle"
      );
    }

    const bannerImage = getUploadPath(req, "bannerImage");
    if (!bannerImage) {
      throw new Error("Banner image is required");
    }

    const slug = buildSlug(name);
    if (!slug) {
      throw new Error("Circle name must contain letters or numbers");
    }

    const existingCircle = await Circle.findOne({ slug });
    if (existingCircle) {
      throw new Error("A Circle with this name already exists");
    }

    const circle = await Circle.create({
      name,
      slug,
      owner: userId,
      bannerImage,
      description,
      stack,
      mode,
      joinApprovalRequired: parseBoolean(joinApprovalRequired),
      postApprovalRequired: parseBoolean(postApprovalRequired),
      memberCount: 1,
    });

    await CircleMember.create({
      circleId: circle._id,
      userId,
      status: "approved",
    });

    return res.status(201).json({ data: circle });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

const getCircles = async (req, res) => {
  try {
    const { owner } = req.query;
    const condition = { published: true };

    if (owner && mongoose.Types.ObjectId.isValid(owner)) {
      condition.owner = owner;
      delete condition.published;
    }

    const circles = await Circle.find(condition).sort("-createdAt");
    return res.status(200).json({ data: circles });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

const getTopCircles = async (req, res) => {
  try {
    const limit = Math.min(Number(req.query.limit) || 8, 30);
    const circles = await Circle.find({ published: true })
      .sort({ memberCount: -1, postCount: -1, createdAt: -1 })
      .limit(limit);

    return res.status(200).json({ data: circles });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

const searchCircles = async (req, res) => {
  try {
    const search = typeof req.query.search === "string" ? req.query.search.trim() : "";
    const limit = Math.min(Number(req.query.limit) || 8, 30);
    const condition = { published: true };

    if (search) {
      const escaped = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      condition.$or = [
        { name: { $regex: escaped, $options: "i" } },
        { stack: { $regex: escaped, $options: "i" } },
      ];
    }

    const circles = await Circle.find(condition)
      .sort({ memberCount: -1, postCount: -1, createdAt: -1 })
      .limit(limit);

    return res.status(200).json({ data: circles });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

const getCircle = async (req, res) => {
  try {
    const { userId, isAdmin } = req.body;
    const circle = await Circle.findOne({ slug: req.params.slug });

    if (!circle || !circle.published) {
      throw new Error("Circle does not exist");
    }

    const membership = await getMembership(circle._id, userId);
    const viewerIsAdmin = Boolean(userId && (circle.owner.equals(userId) || isAdmin));
    const viewerIsMember = isApprovedMember(membership);
    const canSeePrivateContent = circle.mode === "public" || viewerIsMember || viewerIsAdmin;

    const posts = canSeePrivateContent
      ? await Post.find({
          circle: circle._id,
          postType: "circle",
          status: "approved",
        })
          .populate("poster", "-password")
          .populate("circle")
          .populate("tags")
          .sort("-createdAt")
          .lean()
      : [];

    await addViewerHelpful(posts, userId);

    const pendingPosts = viewerIsAdmin
      ? await Post.find({
          circle: circle._id,
          postType: "circle",
          status: "pending",
        })
          .populate("poster", "-password")
          .populate("circle")
          .populate("tags")
          .sort("-createdAt")
          .lean()
      : [];

    const pendingMembers = viewerIsAdmin
      ? await CircleMember.find({ circleId: circle._id, status: "pending" })
          .populate("userId", "-password")
          .sort("createdAt")
          .lean()
      : [];

    const members = canSeePrivateContent
      ? await CircleMember.find({ circleId: circle._id, status: "approved" })
          .populate("userId", "-password")
          .sort("createdAt")
          .lean()
      : [];

    return res.status(200).json({
      data: await enrichCircleForViewer(circle, userId),
      posts,
      members,
      pendingPosts,
      pendingMembers,
      canSeePrivateContent,
    });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

const updateCircle = async (req, res) => {
  try {
    const { userId, isAdmin } = req.body;
    const circle = await Circle.findById(req.params.id);

    if (!circle) {
      throw new Error("Circle does not exist");
    }

    requireCircleAdmin(circle, userId, isAdmin);

    const { name, description, stack, mode } = req.body;

    if (name && name !== circle.name) {
      const slug = buildSlug(name);
      const existingCircle = await Circle.findOne({ slug, _id: { $ne: circle._id } });
      if (existingCircle) {
        throw new Error("A Circle with this name already exists");
      }
      circle.name = name;
      circle.slug = slug;
    }

    if (description) circle.description = description;
    if (stack) circle.stack = stack;
    if (["public", "private"].includes(mode)) circle.mode = mode;
    if (req.body.joinApprovalRequired !== undefined) {
      circle.joinApprovalRequired = parseBoolean(req.body.joinApprovalRequired);
    }
    if (req.body.postApprovalRequired !== undefined) {
      circle.postApprovalRequired = parseBoolean(req.body.postApprovalRequired);
    }

    circle.bannerImage = getUploadPath(req, "bannerImage", circle.bannerImage);
    await circle.save();

    return res.status(200).json({ data: circle });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

const joinCircle = async (req, res) => {
  try {
    const { userId } = req.body;
    const circle = await Circle.findById(req.params.id);

    if (!circle || !circle.published) {
      throw new Error("Circle does not exist");
    }

    if (circle.owner.equals(userId)) {
      throw new Error("Circle admin is already a member");
    }

    const status = circle.joinApprovalRequired ? "pending" : "approved";
    const membership = await CircleMember.findOneAndUpdate(
      { circleId: circle._id, userId },
      { status },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    await refreshCircleCounts(circle);

    return res.status(200).json({
      success: true,
      status: membership.status,
      memberCount: circle.memberCount,
    });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

const leaveCircle = async (req, res) => {
  try {
    const { userId } = req.body;
    const circle = await Circle.findById(req.params.id);

    if (!circle) {
      throw new Error("Circle does not exist");
    }

    if (circle.owner.equals(userId)) {
      throw new Error("Circle admin cannot leave their own Circle");
    }

    await CircleMember.deleteOne({ circleId: circle._id, userId });
    await refreshCircleCounts(circle);

    return res.status(200).json({ success: true, memberCount: circle.memberCount });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

const moderateMember = async (req, res, status) => {
  try {
    const { userId, isAdmin } = req.body;
    const circle = await Circle.findById(req.params.id);

    if (!circle) {
      throw new Error("Circle does not exist");
    }

    requireCircleAdmin(circle, userId, isAdmin);

    const membership = await CircleMember.findById(req.params.memberId);
    if (!membership || !membership.circleId.equals(circle._id)) {
      throw new Error("Member request does not exist");
    }

    membership.status = status;
    await membership.save();
    await refreshCircleCounts(circle);

    return res.status(200).json({ success: true, memberCount: circle.memberCount });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

const kickMember = async (req, res) => {
  try {
    const { userId, isAdmin } = req.body;
    const circle = await Circle.findById(req.params.id);

    if (!circle) {
      throw new Error("Circle does not exist");
    }

    requireCircleAdmin(circle, userId, isAdmin);

    const membership = await CircleMember.findById(req.params.memberId);
    if (!membership || !membership.circleId.equals(circle._id)) {
      throw new Error("Member does not exist");
    }

    if (circle.owner.equals(membership.userId)) {
      throw new Error("Circle admin cannot be kicked");
    }

    await membership.remove();
    await refreshCircleCounts(circle);

    return res.status(200).json({ success: true, memberCount: circle.memberCount });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

const createCirclePost = async (req, res) => {
  try {
    const { title, content, userId } = req.body;
    const circle = await Circle.findById(req.params.id);

    if (!circle || !circle.published) {
      throw new Error("Circle does not exist");
    }

    if (!(title && content)) {
      throw new Error("All input required");
    }

    const user = await User.findById(userId);
    if (!user?.emailVerified) {
      throw new Error("Verify your email before posting in Circles");
    }
    if (!user.githubConnected) {
      throw new Error("Connect GitHub before posting in Circles");
    }

    const membership = await getMembership(circle._id, userId);
    if (!isApprovedMember(membership)) {
      throw new Error("Join this Circle before posting");
    }

    const post = new Post({
      title,
      content,
      poster: userId,
      postType: "circle",
      circle: circle._id,
      status: circle.postApprovalRequired && !circle.owner.equals(userId) ? "pending" : "approved",
    });

    await setPostTags(post, extractHashtags(title, content));
    await post.save();
    await post.populate("poster", "-password");
    await post.populate("circle");
    await post.populate("tags");

    await refreshCircleCounts(circle);

    return res.status(201).json(post);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

const moderatePost = async (req, res, status) => {
  try {
    const { userId, isAdmin } = req.body;
    const circle = await Circle.findById(req.params.id);

    if (!circle) {
      throw new Error("Circle does not exist");
    }

    requireCircleAdmin(circle, userId, isAdmin);

    const post = await Post.findById(req.params.postId).populate("circle");
    if (!post || !post.circle?._id.equals(circle._id) || post.postType !== "circle") {
      throw new Error("Circle post does not exist");
    }

    post.status = status;
    await post.save();
    await post.populate("poster", "-password");
    await post.populate("tags");
    await refreshCircleCounts(circle);

    return res.status(200).json({ data: post, memberCount: circle.memberCount, postCount: circle.postCount });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

const helpfulPost = async (req, res) => {
  try {
    const { userId } = req.body;
    const post = await Post.findById(req.params.postId).populate("circle");

    if (!post || post.postType !== "circle" || post.status !== "approved") {
      throw new Error("Circle post does not exist");
    }

    const membership = await getMembership(post.circle._id, userId);
    if (!isApprovedMember(membership)) {
      throw new Error("Join this Circle to mark posts helpful");
    }

    await CirclePostHelpful.findOneAndUpdate(
      { postId: post._id, userId },
      { postId: post._id, userId },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    post.helpfulCount = await CirclePostHelpful.countDocuments({ postId: post._id });
    await post.save();
    await refreshCircleCounts(post.circle);

    return res.status(200).json({
      success: true,
      helpfulCount: post.helpfulCount,
      viewerHelpful: true,
    });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

const unhelpfulPost = async (req, res) => {
  try {
    const { userId } = req.body;
    const post = await Post.findById(req.params.postId).populate("circle");

    if (!post || post.postType !== "circle") {
      throw new Error("Circle post does not exist");
    }

    const membership = await getMembership(post.circle._id, userId);
    if (!isApprovedMember(membership)) {
      throw new Error("Join this Circle to update helpful marks");
    }

    await CirclePostHelpful.deleteOne({ postId: post._id, userId });
    post.helpfulCount = await CirclePostHelpful.countDocuments({ postId: post._id });
    await post.save();
    await refreshCircleCounts(post.circle);

    return res.status(200).json({
      success: true,
      helpfulCount: post.helpfulCount,
      viewerHelpful: false,
    });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

module.exports = {
  createCircle,
  getCircles,
  getTopCircles,
  searchCircles,
  getCircle,
  updateCircle,
  joinCircle,
  leaveCircle,
  approveMember: (req, res) => moderateMember(req, res, "approved"),
  rejectMember: (req, res) => moderateMember(req, res, "rejected"),
  kickMember,
  createCirclePost,
  approvePost: (req, res) => moderatePost(req, res, "approved"),
  rejectPost: (req, res) => moderatePost(req, res, "rejected"),
  helpfulPost,
  unhelpfulPost,
};
