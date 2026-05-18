const Tag = require("../models/Tag");

const MAX_TAGS_PER_POST = 10;
const HASHTAG_REGEX = /(^|[^\w])#([a-zA-Z0-9][a-zA-Z0-9._+-]{0,29})/g;

const extractHashtags = (...values) => {
  const tags = [];
  const seen = new Set();
  const text = values.filter(Boolean).join(" ");
  let match;

  HASHTAG_REGEX.lastIndex = 0;

  while ((match = HASHTAG_REGEX.exec(text)) !== null) {
    const tag = match[2].toLowerCase();

    if (!seen.has(tag)) {
      seen.add(tag);
      tags.push(tag);
    }

    if (tags.length >= MAX_TAGS_PER_POST) break;
  }

  HASHTAG_REGEX.lastIndex = 0;

  return tags;
};

const getOrCreateTags = async (tagNames) => {
  if (!tagNames.length) return [];

  await Promise.all(
    tagNames.map((name) =>
      Tag.updateOne({ name }, { $setOnInsert: { name } }, { upsert: true })
    )
  );

  return Tag.find({ name: { $in: tagNames } });
};

const setPostTags = async (post, tagNames) => {
  const previousTagIds = (post.tags || []).map((tag) => tag.toString());
  const tags = await getOrCreateTags(tagNames);
  const nextTagIds = tags.map((tag) => tag._id.toString());

  const removedTagIds = previousTagIds.filter((id) => !nextTagIds.includes(id));
  const addedTagIds = nextTagIds.filter((id) => !previousTagIds.includes(id));

  if (removedTagIds.length) {
    await Tag.updateMany(
      { _id: { $in: removedTagIds } },
      { $inc: { postCount: -1 } }
    );
  }

  if (addedTagIds.length) {
    await Tag.updateMany(
      { _id: { $in: addedTagIds } },
      { $inc: { postCount: 1 } }
    );
  }

  post.tags = tags.map((tag) => tag._id);
};

const removePostTags = async (post) => {
  const tagIds = (post.tags || []).map((tag) => tag.toString());

  if (!tagIds.length) return;

  await Tag.updateMany({ _id: { $in: tagIds } }, { $inc: { postCount: -1 } });
};

module.exports = {
  extractHashtags,
  setPostTags,
  removePostTags,
};
