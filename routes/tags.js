const express = require("express");
const router = express.Router();
const tagControllers = require("../controllers/tagControllers");

router.get("/", tagControllers.getTopTags);

module.exports = router;
