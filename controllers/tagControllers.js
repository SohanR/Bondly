const Tag = require("../models/Tag");

const getTopTags = async (req, res) => {
  try {
    const limit = Math.min(Number(req.query.limit) || 12, 30);
    const tags = await Tag.find({ postCount: { $gt: 0 } })
      .sort({ postCount: -1, name: 1 })
      .limit(limit);

    return res.status(200).json({ data: tags });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

module.exports = {
  getTopTags,
};
