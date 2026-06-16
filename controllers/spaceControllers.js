const mongoose = require("mongoose");
const Space = require("../models/Space");
const SpaceFollow = require("../models/SpaceFollow");
const SpacePostVote = require("../models/SpacePostVote");
const Post = require("../models/Post");
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

const parseLinks = (value) => {
  if (!value) return [];

  if (Array.isArray(value)) return value.slice(0, 2);

  try {
    const links = JSON.parse(value);
    return Array.isArray(links) ? links.slice(0, 2) : [];
  } catch (err) {
    throw new Error("Links must be valid JSON");
  }
};

const getUploadPath = (req, fieldName, fallback) => {
  const file = req.files && req.files[fieldName] && req.files[fieldName][0];
  if (!file) return fallback;
  return `/uploads/spaces/${file.filename}`;
};

const requireOwner = (space, userId, isAdmin) => {
  if (!space.owner.equals(userId) && !isAdmin) {
    throw new Error("Not authorized to manage this space");
  }
};

const enrichSpaceForViewer = async (space, userId) => {
  const data = space.toObject ? space.toObject() : { ...space };
  data.followed = false;

  if (userId) {
    data.followed = Boolean(
      await SpaceFollow.findOne({ spaceId: data._id, userId })
    );
  }

  return data;
};

const createSpace = async (req, res) => {
  try {
    const { userId } = req.body;
    const { name, about, specialization, policyAccepted } = req.body;

    if (!(name && about && specialization)) {
      throw new Error("Name, about, and specialization are required");
    }

    if (policyAccepted !== "true" && policyAccepted !== true) {
      throw new Error("Policy agreement is required");
    }

    const user = await require("../models/User").findById(userId);
    if (!user) {
      throw new Error("User does not exist");
    }

    const badgeState = await getUserBadgeState(user);
    if (!badgeState.canCreateSpace) {
      throw new Error(
        "You need Verified User, Developer, and at least one more badge to create a Space"
      );
    }

    const avatarImage = getUploadPath(req, "avatarImage");
    const bannerImage = getUploadPath(req, "bannerImage");

    if (!(avatarImage && bannerImage)) {
      throw new Error("Avatar and banner images are required");
    }

    const slug = buildSlug(name);

    if (!slug) {
      throw new Error("Space name must contain letters or numbers");
    }

    const existingSpace = await Space.findOne({ slug });
    if (existingSpace) {
      throw new Error("A space with this name already exists");
    }

    const space = await Space.create({
      name,
      slug,
      owner: userId,
      avatarImage,
      bannerImage,
      about,
      specialization,
      links: parseLinks(req.body.links),
    });

    return res.status(201).json({ data: space });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

const getSpaces = async (req, res) => {
  try {
    const { owner } = req.query;
    const condition = { published: true };

    if (owner && mongoose.Types.ObjectId.isValid(owner)) {
      condition.owner = owner;
      delete condition.published;
    }

    const spaces = await Space.find(condition).sort("-createdAt");
    return res.status(200).json({ data: spaces });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

const getTopSpaces = async (req, res) => {
  try {
    const limit = Math.min(Number(req.query.limit) || 8, 30);
    const spaces = await Space.find({ published: true })
      .sort({ followerCount: -1, impressionCount: -1, createdAt: -1 })
      .limit(limit);

    return res.status(200).json({ data: spaces });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

const searchSpaces = async (req, res) => {
  try {
    const search = typeof req.query.search === "string" ? req.query.search.trim() : "";
    const limit = Math.min(Number(req.query.limit) || 8, 30);
    const condition = { published: true };

    if (search) {
      const escaped = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      condition.$or = [
        { name: { $regex: escaped, $options: "i" } },
        { specialization: { $regex: escaped, $options: "i" } },
      ];
    }

    const spaces = await Space.find(condition)
      .sort({ followerCount: -1, impressionCount: -1, createdAt: -1 })
      .limit(limit);

    return res.status(200).json({ data: spaces });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

const getSpace = async (req, res) => {
  try {
    const { userId } = req.body;
    const space = await Space.findOne({ slug: req.params.slug });

    if (!space) {
      throw new Error("Space does not exist");
    }

    const isOwner = userId && space.owner.equals(userId);
    if (!space.published && !isOwner) {
      throw new Error("Space does not exist");
    }

    const posts = await Post.find({ space: space._id, postType: "space" })
      .populate("poster", "-password")
      .populate("space")
      .populate("tags")
      .sort("-createdAt")
      .lean();

    if (userId) {
      const votes = await SpacePostVote.find({
        postId: { $in: posts.map((post) => post._id) },
        userId,
      });

      posts.forEach((post) => {
        const vote = votes.find((item) => item.postId.equals(post._id));
        if (vote) post.viewerVote = vote.value;
      });
    }

    return res.status(200).json({
      data: await enrichSpaceForViewer(space, userId),
      posts,
    });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

const updateSpace = async (req, res) => {
  try {
    const { userId, isAdmin } = req.body;
    const space = await Space.findById(req.params.id);

    if (!space) {
      throw new Error("Space does not exist");
    }

    requireOwner(space, userId, isAdmin);

    const { name, about, specialization } = req.body;

    if (name && name !== space.name) {
      const slug = buildSlug(name);
      const existingSpace = await Space.findOne({ slug, _id: { $ne: space._id } });
      if (existingSpace) {
        throw new Error("A space with this name already exists");
      }
      space.name = name;
      space.slug = slug;
    }

    if (about) space.about = about;
    if (specialization) space.specialization = specialization;
    if (req.body.links !== undefined) space.links = parseLinks(req.body.links);

    space.avatarImage = getUploadPath(req, "avatarImage", space.avatarImage);
    space.bannerImage = getUploadPath(req, "bannerImage", space.bannerImage);

    await space.save();

    return res.status(200).json({ data: space });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

const unpublishSpace = async (req, res) => {
  try {
    const { userId, isAdmin } = req.body;
    const space = await Space.findById(req.params.id);

    if (!space) {
      throw new Error("Space does not exist");
    }

    requireOwner(space, userId, isAdmin);
    space.published = false;
    await space.save();

    return res.status(200).json({ data: space });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

const followSpace = async (req, res) => {
  try {
    const { userId } = req.body;
    const space = await Space.findById(req.params.id);

    if (!space || !space.published) {
      throw new Error("Space does not exist");
    }

    const existingFollow = await SpaceFollow.findOne({ spaceId: space._id, userId });

    if (!existingFollow) {
      await SpaceFollow.create({ spaceId: space._id, userId });
      space.followerCount = await SpaceFollow.countDocuments({ spaceId: space._id });
      await space.save();
    }

    return res.status(200).json({ success: true, followerCount: space.followerCount });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

const unfollowSpace = async (req, res) => {
  try {
    const { userId } = req.body;
    const space = await Space.findById(req.params.id);

    if (!space) {
      throw new Error("Space does not exist");
    }

    await SpaceFollow.deleteOne({ spaceId: space._id, userId });
    space.followerCount = await SpaceFollow.countDocuments({ spaceId: space._id });
    await space.save();

    return res.status(200).json({ success: true, followerCount: space.followerCount });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

const createSpacePost = async (req, res) => {
  try {
    const { title, content, userId, isAdmin } = req.body;
    const space = await Space.findById(req.params.id);

    if (!space || !space.published) {
      throw new Error("Space does not exist");
    }

    requireOwner(space, userId, isAdmin);

    if (!(title && content)) {
      throw new Error("All input required");
    }

    const post = new Post({
      title,
      content,
      poster: userId,
      postType: "space",
      space: space._id,
    });

    await setPostTags(post, extractHashtags(title, content));
    await post.save();
    await post.populate("poster", "-password");
    await post.populate("space");
    await post.populate("tags");

    space.postCount = await Post.countDocuments({
      space: space._id,
      postType: "space",
    });
    await space.save();

    return res.status(201).json(post);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

module.exports = {
  createSpace,
  getSpaces,
  getTopSpaces,
  searchSpaces,
  getSpace,
  updateSpace,
  unpublishSpace,
  followSpace,
  unfollowSpace,
  createSpacePost,
};
