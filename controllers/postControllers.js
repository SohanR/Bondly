const mongoose = require("mongoose");
const Post = require("../models/Post");
const User = require("../models/User");
const Comment = require("../models/Comment");
const PostLike = require("../models/PostLike");
const Space = require("../models/Space");
const SpacePostVote = require("../models/SpacePostVote");
const Circle = require("../models/Circle");
const CircleMember = require("../models/CircleMember");
const CirclePostHelpful = require("../models/CirclePostHelpful");
const paginate = require("../util/paginate");
const Tag = require("../models/Tag");
const {
  extractHashtags,
  removePostTags,
  setPostTags,
} = require("../util/tags");
const cooldown = new Set();

USER_LIKES_PAGE_SIZE = 9;

const escapeRegex = (value) => {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

const getSearchTermVariants = (term) => {
  const variants = [term];

  if (term.length > 3 && term.endsWith("s") && !term.endsWith("ss")) {
    variants.push(term.slice(0, -1));
  }

  return variants;
};

const buildTitleSearchCondition = (search) => {
  if (typeof search !== "string") return {};

  const searchTerms = search
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .flatMap(getSearchTermVariants)
    .map(escapeRegex);

  if (searchTerms.length === 0) return {};

  return {
    title: {
      $regex: searchTerms.join("|"),
      $options: "i",
    },
  };
};

const createPost = async (req, res) => {
  try {
    const { title, content, userId } = req.body;

    if (!(title && content)) {
      throw new Error("All input required");
    }

    const user = await User.findById(userId);
    if (!user?.emailVerified) {
      throw new Error("Verify your email before creating posts");
    }

    if (cooldown.has(userId)) {
      throw new Error(
        "You are posting too frequently. Please try again shortly."
      );
    }

    cooldown.add(userId);
    setTimeout(() => {
      cooldown.delete(userId);
    }, 60000);

    const post = new Post({
      title,
      content,
      poster: userId,
    });

    await setPostTags(post, extractHashtags(title, content));
    await post.save();
    await post.populate("tags");

    res.json(post);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

const getPost = async (req, res) => {
  try {
    const postId = req.params.id;
    const { userId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(postId)) {
      throw new Error("Post does not exist");
    }

    const post = await Post.findById(postId)
      .populate("poster", "-password")
      .populate("space")
      .populate("circle")
      .populate("tags")
      .lean();

    if (!post) {
      throw new Error("Post does not exist");
    }

    if (post.postType === "space" && !post.space?.published) {
      throw new Error("Post does not exist");
    }

    if (post.postType === "circle") {
      const canViewCirclePost = await canViewerSeeCirclePost(post, userId);
      if (!canViewCirclePost) {
        throw new Error("Post does not exist");
      }
    }

    if (userId) {
      await setLiked([post], userId);
      await setSpaceVotes([post], userId);
      await setCircleHelpful([post], userId);
    }

    await enrichWithUserLikePreview([post]);

    return res.json(post);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

const updatePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const { content, userId, isAdmin } = req.body;

    const post = await Post.findById(postId).populate("space");

    if (!post) {
      throw new Error("Post does not exist");
    }

    if (post.postType === "circle") {
      await post.populate("circle");
    }

    const isCircleAdmin =
      post.postType === "circle" && post.circle?.owner?.equals(userId);

    if (post.poster != userId && !isAdmin && !isCircleAdmin) {
      throw new Error("Not authorized to update post");
    }

    post.content = content;
    post.edited = true;
    await setPostTags(post, extractHashtags(post.title, content));

    await post.save();
    await post.populate("space");
    await post.populate("tags");

    return res.json(post);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

const deletePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const { userId, isAdmin } = req.body;

    const post = await Post.findById(postId).populate("space");

    if (!post) {
      throw new Error("Post does not exist");
    }

    if (post.postType === "circle") {
      await post.populate("circle");
    }

    const isCircleAdmin =
      post.postType === "circle" && post.circle?.owner?.equals(userId);

    if (post.poster != userId && !isAdmin && !isCircleAdmin) {
      throw new Error("Not authorized to delete post");
    }

    await removePostTags(post);
    await post.remove();

    await Comment.deleteMany({ post: post._id });

    if (post.postType === "space" && post.space) {
      const space = await Space.findById(post.space._id);
      if (space) {
        space.postCount = await Post.countDocuments({
          space: space._id,
          postType: "space",
        });
        await refreshSpaceVoteTotals(space);
      }
    }

    if (post.postType === "circle" && post.circle) {
      const circle = await Circle.findById(post.circle._id);
      if (circle) {
        await refreshCircleTotals(circle);
      }
    }

    return res.json(post);
  } catch (err) {
    console.log(err);
    return res.status(400).json({ error: err.message });
  }
};

const setLiked = async (posts, userId) => {
  let searchCondition = {};
  if (userId) searchCondition = { userId };

  const userPostLikes = await PostLike.find(searchCondition); //userId needed

  posts.forEach((post) => {
    if (post.postType === "space" || post.postType === "circle") return;

    userPostLikes.forEach((userPostLike) => {
      if (userPostLike.postId.equals(post._id)) {
        post.liked = true;
        return;
      }
    });
  });
};

const setSpaceVotes = async (posts, userId) => {
  if (!userId) return;

  const spacePostIds = posts
    .filter((post) => post.postType === "space")
    .map((post) => post._id);

  if (!spacePostIds.length) return;

  const votes = await SpacePostVote.find({
    postId: { $in: spacePostIds },
    userId,
  });

  posts.forEach((post) => {
    const vote = votes.find((item) => item.postId.equals(post._id));
    if (vote) post.viewerVote = vote.value;
  });
};

const setCircleHelpful = async (posts, userId) => {
  if (!userId) return;

  const circlePostIds = posts
    .filter((post) => post.postType === "circle")
    .map((post) => post._id);

  if (!circlePostIds.length) return;

  const helpfuls = await CirclePostHelpful.find({
    postId: { $in: circlePostIds },
    userId,
  });

  posts.forEach((post) => {
    post.viewerHelpful = helpfuls.some((item) => item.postId.equals(post._id));
  });
};

const canViewerSeeCirclePost = async (post, userId) => {
  if (post.status !== "approved") return false;
  if (!post.circle?.published) return false;
  if (post.circle.mode === "public") return true;
  if (!userId) return false;

  if (String(post.circle.owner) === String(userId)) return true;

  const membership = await CircleMember.findOne({
    circleId: post.circle._id,
    userId,
    status: "approved",
  });

  return Boolean(membership);
};

const refreshSpaceVoteTotals = async (space) => {
  const totals = await Post.aggregate([
    { $match: { space: space._id, postType: "space" } },
    {
      $group: {
        _id: "$space",
        voteCount: { $sum: "$voteScore" },
        impressionCount: { $sum: "$impressionCount" },
      },
    },
  ]);

  space.voteCount = totals[0]?.voteCount || 0;
  space.impressionCount = totals[0]?.impressionCount || 0;
  await space.save();
};

const refreshCircleTotals = async (circle) => {
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

const enrichWithUserLikePreview = async (posts) => {
  const postMap = posts.reduce((result, post) => {
    result[post._id] = post;
    return result;
  }, {});

  const postLikes = await PostLike.find({
    postId: { $in: Object.keys(postMap) },
  })
    .limit(200)
    .populate("userId", "username");

  postLikes.forEach((postLike) => {
    const post = postMap[postLike.postId];
    if (!post.userLikePreview) {
      post.userLikePreview = [];
    }
    post.userLikePreview.push(postLike.userId);
  });
};

const getUserLikedPosts = async (req, res) => {
  try {
    const likerId = req.params.id;
    const { userId } = req.body;
    let { page, sortBy } = req.query;

    if (!sortBy) sortBy = "-createdAt";
    if (!page) page = 1;

    let posts = await PostLike.find({ userId: likerId })
      .sort(sortBy)
      .populate({
        path: "postId",
        populate: [
          { path: "poster" },
          { path: "space" },
          { path: "circle" },
          { path: "tags" },
        ],
      })
      .lean();

    posts = paginate(posts, 10, page);

    const count = posts.length;

    let responsePosts = [];
    posts.forEach((post) => {
      if (post.postId && post.postId.poster) {
        responsePosts.push(post.postId);
      }
    });

    if (userId) {
      await setLiked(responsePosts, userId);
      await setSpaceVotes(responsePosts, userId);
      await setCircleHelpful(responsePosts, userId);
    }

    await enrichWithUserLikePreview(responsePosts);

    return res.json({ data: responsePosts, count });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ error: err.message });
  }
};

const getPosts = async (req, res) => {
  try {
    const { userId } = req.body;

    let { page, sortBy, author, search, tag, space, circle } = req.query;

    if (!sortBy) sortBy = "-createdAt";
    if (!page) page = 1;

    const searchCondition = buildTitleSearchCondition(search);

    if (tag) {
      const tagDocument = await Tag.findOne({ name: tag.toLowerCase() });

      if (!tagDocument) {
        return res.json({ data: [], count: 0 });
      }

      searchCondition.tags = tagDocument._id;
    }

    let requestedSpace = null;
    if (space) {
      requestedSpace = await Space.findOne({ slug: space, published: true });

      if (!requestedSpace) {
        return res.json({ data: [], count: 0 });
      }

      searchCondition.space = requestedSpace._id;
      searchCondition.postType = "space";
    }

    let requestedCircle = null;
    if (circle) {
      requestedCircle = await Circle.findOne({ slug: circle, published: true });

      if (!requestedCircle) {
        return res.json({ data: [], count: 0 });
      }

      const canViewCircle =
        requestedCircle.mode === "public" ||
        (userId &&
          (requestedCircle.owner.equals(userId) ||
            (await CircleMember.findOne({
              circleId: requestedCircle._id,
              userId,
              status: "approved",
            }))));

      if (!canViewCircle) {
        return res.json({ data: [], count: 0 });
      }

      searchCondition.circle = requestedCircle._id;
      searchCondition.postType = "circle";
      searchCondition.status = "approved";
    }

    let posts = await Post.find(searchCondition)
      .populate("poster", "-password")
      .populate("space")
      .populate("circle")
      .populate("tags")
      .sort(sortBy)
      .lean();

    posts = posts.filter((post) => {
      if (post.postType === "space") return post.space?.published;
      if (post.postType === "circle") {
        return (
          post.status === "approved" &&
          post.circle?.published &&
          (circle || post.circle.mode === "public")
        );
      }
      return true;
    });

    if (author) {
      posts = posts.filter(
        (post) =>
          post.postType !== "space" &&
          post.postType !== "circle" &&
          post.poster?.username == author
      );
    }

    const count = posts.length;

    posts = paginate(posts, 10, page);

    if (userId) {
      await setLiked(posts, userId);
      await setSpaceVotes(posts, userId);
      await setCircleHelpful(posts, userId);
    }

    await enrichWithUserLikePreview(posts);

    return res.json({ data: posts, count });
  } catch (err) {
    console.log(err.message);
    return res.status(400).json({ error: err.message });
  }
};

const likePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const { userId } = req.body;

    const post = await Post.findById(postId);

    if (!post) {
      throw new Error("Post does not exist");
    }

    if (post.postType === "space") {
      throw new Error("Space posts use votes instead of likes");
    }

    const existingPostLike = await PostLike.findOne({ postId, userId });

    if (existingPostLike) {
      throw new Error("Post is already liked");
    }

    await PostLike.create({
      postId,
      userId,
    });

    post.likeCount = (await PostLike.find({ postId })).length;

    await post.save();

    return res.json({ success: true });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

const unlikePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const { userId } = req.body;

    const post = await Post.findById(postId);

    if (!post) {
      throw new Error("Post does not exist");
    }

    if (post.postType === "space") {
      throw new Error("Space posts use votes instead of likes");
    }

    const existingPostLike = await PostLike.findOne({ postId, userId });

    if (!existingPostLike) {
      throw new Error("Post is already not liked");
    }

    await existingPostLike.remove();

    post.likeCount = (await PostLike.find({ postId })).length;

    await post.save();

    return res.json({ success: true });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

const votePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const { userId, value } = req.body;
    const voteValue = Number(value);

    if (![1, -1].includes(voteValue)) {
      throw new Error("Vote value must be 1 or -1");
    }

    const post = await Post.findById(postId).populate("space");

    if (!post || post.postType !== "space" || !post.space?.published) {
      throw new Error("Space post does not exist");
    }

    const existingVote = await SpacePostVote.findOne({ postId, userId });

    if (existingVote) {
      existingVote.value = voteValue;
      await existingVote.save();
    } else {
      await SpacePostVote.create({ postId, userId, value: voteValue });
    }

    await refreshPostVoteCounts(post);
    await refreshSpaceVoteTotals(post.space);

    return res.json({
      success: true,
      upvoteCount: post.upvoteCount,
      downvoteCount: post.downvoteCount,
      voteScore: post.voteScore,
      impressionCount: post.impressionCount,
      viewerVote: voteValue,
    });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

const unvotePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const { userId } = req.body;
    const post = await Post.findById(postId).populate("space");

    if (!post || post.postType !== "space") {
      throw new Error("Space post does not exist");
    }

    await SpacePostVote.deleteOne({ postId, userId });
    await refreshPostVoteCounts(post);
    if (post.space) await refreshSpaceVoteTotals(post.space);

    return res.json({
      success: true,
      upvoteCount: post.upvoteCount,
      downvoteCount: post.downvoteCount,
      voteScore: post.voteScore,
      impressionCount: post.impressionCount,
      viewerVote: null,
    });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

const refreshPostVoteCounts = async (post) => {
  const upvoteCount = await SpacePostVote.countDocuments({
    postId: post._id,
    value: 1,
  });
  const downvoteCount = await SpacePostVote.countDocuments({
    postId: post._id,
    value: -1,
  });

  post.upvoteCount = upvoteCount;
  post.downvoteCount = downvoteCount;
  post.voteScore = upvoteCount - downvoteCount;
  post.impressionCount = upvoteCount + downvoteCount;
  await post.save();
};

const getUserLikes = async (req, res) => {
  try {
    const { postId } = req.params;
    const { anchor } = req.query;

    const postLikesQuery = PostLike.find({ postId: postId })
      .sort("_id")
      .limit(USER_LIKES_PAGE_SIZE + 1)
      .populate("userId", "username");

    if (anchor) {
      postLikesQuery.where("_id").gt(anchor);
    }

    const postLikes = await postLikesQuery.exec();

    const hasMorePages = postLikes.length > USER_LIKES_PAGE_SIZE;

    if (hasMorePages) postLikes.pop();

    const userLikes = postLikes.map((like) => {
      return {
        id: like._id,
        username: like.userId.username,
      };
    });

    return res
      .status(400)
      .json({ userLikes: userLikes, hasMorePages, success: true });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

module.exports = {
  getPost,
  getPosts,
  createPost,
  updatePost,
  deletePost,
  likePost,
  unlikePost,
  votePost,
  unvotePost,
  getUserLikedPosts,
  getUserLikes,
};
