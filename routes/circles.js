const express = require("express");
const router = express.Router();
const circleControllers = require("../controllers/circleControllers");
const { optionallyVerifyToken, verifyToken } = require("../middleware/auth");
const { uploadCircleImages } = require("../middleware/upload");

const mergeAuthBody = (req, res, next) => {
  req.body = {
    ...req.body,
    ...(req.auth || {}),
  };
  next();
};

router.get("/", circleControllers.getCircles);
router.get("/top", circleControllers.getTopCircles);
router.get("/search", circleControllers.searchCircles);
router.get("/:slug", optionallyVerifyToken, circleControllers.getCircle);
router.post("/", verifyToken, uploadCircleImages, mergeAuthBody, circleControllers.createCircle);
router.patch("/:id", verifyToken, uploadCircleImages, mergeAuthBody, circleControllers.updateCircle);
router.post("/:id/join", verifyToken, circleControllers.joinCircle);
router.delete("/:id/join", verifyToken, circleControllers.leaveCircle);
router.post("/:id/members/:memberId/approve", verifyToken, circleControllers.approveMember);
router.post("/:id/members/:memberId/reject", verifyToken, circleControllers.rejectMember);
router.delete("/:id/members/:memberId", verifyToken, circleControllers.kickMember);
router.post("/:id/posts", verifyToken, circleControllers.createCirclePost);
router.post("/:id/posts/:postId/approve", verifyToken, circleControllers.approvePost);
router.post("/:id/posts/:postId/reject", verifyToken, circleControllers.rejectPost);
router.post("/posts/:postId/helpful", verifyToken, circleControllers.helpfulPost);
router.delete("/posts/:postId/helpful", verifyToken, circleControllers.unhelpfulPost);

module.exports = router;
