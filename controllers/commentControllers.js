const Comment = require("../models/Comment");
const mongoose = require("mongoose");
const Post = require("../models/Post");
const CircleMember = require("../models/CircleMember");
const paginate = require("../util/paginate");

const COMMENT_RATE_LIMIT = 10;
const COMMENT_RATE_WINDOW_MS = 60 * 1000;
const COMMENT_COOLDOWN_MS = 60 * 1000;
const commentActivity = new Map();

const isCommentRateLimited = (userId) => {
  const now = Date.now();
  const activity = commentActivity.get(userId) || {
    timestamps: [],
    cooldownUntil: 0,
  };

  if (activity.cooldownUntil > now) {
    return true;
  }

  activity.cooldownUntil = 0;
  activity.timestamps = activity.timestamps.filter(
    (timestamp) => now - timestamp < COMMENT_RATE_WINDOW_MS
  );
  activity.timestamps.push(now);

  if (activity.timestamps.length >= COMMENT_RATE_LIMIT) {
    activity.timestamps = [];
    activity.cooldownUntil = now + COMMENT_COOLDOWN_MS;
  }

  commentActivity.set(userId, activity);

  if (activity.timestamps.length === 0) {
    setTimeout(() => {
      const latestActivity = commentActivity.get(userId);

      if (
        latestActivity &&
        latestActivity.cooldownUntil <= Date.now() &&
        latestActivity.timestamps.length === 0
      ) {
        commentActivity.delete(userId);
      }
    }, COMMENT_COOLDOWN_MS);
  }

  return false;
};

const createComment = async (req, res) => {
  try {
    const postId = req.params.id;
    const { content, parentId, userId } = req.body;

    const post = await Post.findById(postId).populate("circle");

    if (!post) {
      throw new Error("Post not found");
    }

    if (post.postType === "circle") {
      const membership = await CircleMember.findOne({
        circleId: post.circle?._id,
        userId,
        status: "approved",
      });

      if (!membership) {
        throw new Error("Join this Circle before commenting");
      }
    }

    if (isCommentRateLimited(userId)) {
      throw new Error(
        "You are commenting too frequently. Please try again in 1 minute."
      );
    }

    const comment = await Comment.create({
      content,
      parent: parentId,
      post: postId,
      commenter: userId,
    });

    post.commentCount += 1;

    await post.save();

    await Comment.populate(comment, { path: "commenter", select: "-password" });

    return res.json(comment);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

const getPostComments = async (req, res) => {
  try {
    const postId = req.params.id;
    const { userId } = req.body;

    const post = await Post.findById(postId).populate("circle");
    if (!post) {
      throw new Error("Post not found");
    }

    if (post.postType === "circle") {
      const canView =
        post.status === "approved" &&
        post.circle?.published &&
        (post.circle.mode === "public" ||
          (userId &&
            (post.circle.owner.equals(userId) ||
              (await CircleMember.findOne({
                circleId: post.circle._id,
                userId,
                status: "approved",
              })))));

      if (!canView) {
        throw new Error("Post not found");
      }
    }

    const comments = await Comment.find({ post: postId })
      .populate("commenter", "-password")
      .sort("-createdAt");

    let commentParents = {};
    let rootComments = [];

    for (let i = 0; i < comments.length; i++) {
      let comment = comments[i];
      commentParents[comment._id] = comment;
    }

    for (let i = 0; i < comments.length; i++) {
      const comment = comments[i];
      if (comment.parent) {
        let commentParent = commentParents[comment.parent];
        commentParent.children = [...commentParent.children, comment];
      } else {
        rootComments = [...rootComments, comment];
      }
    }

    return res.json(rootComments);
  } catch (err) {
    return res.status(400).json(err.message);
  }
};

const getUserComments = async (req, res) => {
  try {
    const userId = req.params.id;

    let { page, sortBy } = req.query;

    if (!sortBy) sortBy = "-createdAt";
    if (!page) page = 1;

    let comments = await Comment.find({ commenter: userId })
      .sort(sortBy)
      .populate("post");

    return res.json(comments);
  } catch (err) {
    return res.status(400).json(err.message);
  }
};

const updateComment = async (req, res) => {
  try {
    const commentId = req.params.id;
    const { userId, content, isAdmin } = req.body;

    if (!content) {
      throw new Error("All input required");
    }

    const comment = await Comment.findById(commentId);

    if (!comment) {
      throw new Error("Comment not found");
    }

    if (comment.commenter != userId && !isAdmin) {
      throw new Error("Not authorized to update comment");
    }

    comment.content = content;
    comment.edited = true;
    await comment.save();

    return res.status(200).json(comment);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

const deleteComment = async (req, res) => {
  try {
    const commentId = req.params.id;
    const { userId, isAdmin } = req.body;

    const comment = await Comment.findById(commentId);

    if (!comment) {
      throw new Error("Comment not found");
    }

    if (comment.commenter != userId && !isAdmin) {
      throw new Error("Not authorized to delete comment");
    }

    await comment.remove();

    const post = await Post.findById(comment.post);

    post.commentCount = (await Comment.find({ post: post._id })).length;

    await post.save();

    return res.status(200).json(comment);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

module.exports = {
  createComment,
  getPostComments,
  getUserComments,
  updateComment,
  deleteComment,
};
