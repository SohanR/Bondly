const express = require("express");
const router = express.Router();
const userControllers = require("../controllers/userControllers");
const { check } = require("express-validator");
const { verifyToken } = require("../middleware/auth");

router.post("/register", userControllers.register);
router.post("/login", userControllers.login);
router.get("/random", userControllers.getRandomUsers);
router.post(
  "/email-verification/send",
  verifyToken,
  userControllers.sendEmailVerificationOtp
);
router.post(
  "/email-verification/confirm",
  verifyToken,
  userControllers.confirmEmailVerificationOtp
);
router.get("/github/connect", userControllers.githubConnect);
router.get("/github/callback", userControllers.githubCallback);
router.patch("/badges/showcase", verifyToken, userControllers.updateShowcaseBadges);

router.get("/:username", userControllers.getUser);
router.patch("/:id", verifyToken, userControllers.updateUser);

router.post("/follow/:id", verifyToken, userControllers.follow);
router.delete("/unfollow/:id", verifyToken, userControllers.unfollow);

router.get("/followers/:id", userControllers.getFollowers);
router.get("/following/:id", userControllers.getFollowing);

module.exports = router;
