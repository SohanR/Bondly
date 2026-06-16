const express = require("express");
const router = express.Router();
const spaceControllers = require("../controllers/spaceControllers");
const { optionallyVerifyToken, verifyToken } = require("../middleware/auth");
const { uploadSpaceImages } = require("../middleware/upload");

const mergeAuthBody = (req, res, next) => {
  req.body = {
    ...req.body,
    ...(req.auth || {}),
  };
  next();
};

router.get("/", spaceControllers.getSpaces);
router.get("/top", spaceControllers.getTopSpaces);
router.get("/search", spaceControllers.searchSpaces);
router.get("/:slug", optionallyVerifyToken, spaceControllers.getSpace);
router.post("/", verifyToken, uploadSpaceImages, mergeAuthBody, spaceControllers.createSpace);
router.patch("/:id", verifyToken, uploadSpaceImages, mergeAuthBody, spaceControllers.updateSpace);
router.delete("/:id", verifyToken, spaceControllers.unpublishSpace);
router.post("/:id/follow", verifyToken, spaceControllers.followSpace);
router.delete("/:id/follow", verifyToken, spaceControllers.unfollowSpace);
router.post("/:id/posts", verifyToken, spaceControllers.createSpacePost);

module.exports = router;
