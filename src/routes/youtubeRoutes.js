const express = require("express");
const {
  getAuthUrl,
  oauth2Callback,
  getUserVideos,
  likeVideo,
} = require("../controller/youtubeController");

const router = express.Router();

router.get("/auth-url", getAuthUrl);
router.get("/oauth2callback", oauth2Callback);
router.get("/videos", getUserVideos);
router.post("/like", likeVideo);

module.exports = router;
