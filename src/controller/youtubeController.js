const { google } = require("googleapis");
const oauth2Client = require("../../config/oauth2");
const {
  getTokens,
  saveAccessToken,
  saveRefreshToken,
} = require("../helper/tokenManager");

// Generate the OAuth2 URL for user authentication
exports.getAuthUrl = (req, res) => {
  const scopes = ["https://www.googleapis.com/auth/youtube.force-ssl"];
  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: scopes,
  });
  res.status(200).json({ url });
};

// Handle OAuth2 callback and store tokens
exports.oauth2Callback = async (req, res) => {
  const { code } = req.query;
  if (!code) {
    return res.status(400).json({ error: "Authorization code is missing." });
  }
  try {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);
    if (tokens.access_token) await saveAccessToken(tokens.access_token);
    if (tokens.refresh_token) await saveRefreshToken(tokens.refresh_token);
    res.status(200).json({
      message: "Authentication successful",
      tokens,
    });
  } catch (error) {
    console.error("Error during OAuth2 callback:", error);
    res.status(400).json({
      error: "Failed to exchange authorization code for tokens.",
      details: error.message,
    });
  }
};


exports.getUserVideos = async (req, res) => {
  try {
    const tokens = await getTokens();

    if (!tokens) {
      return res.status(401).json({ error: "Missing or expired tokens" });
    }

    oauth2Client.setCredentials(tokens);
    const youtube = google.youtube({ version: "v3", auth: oauth2Client });

    const channelResponse = await youtube.channels.list({
      part: "contentDetails",
      mine: true,
    });

    const uploadsPlaylistId =
      channelResponse?.data?.items[0].contentDetails.relatedPlaylists.uploads;

    const videosResponse = await youtube.playlistItems.list({
      part: "snippet,contentDetails",
      playlistId: uploadsPlaylistId,
      maxResults: 10,
    });

    // Return video details
    if (videosResponse?.data?.items?.length === 0) {
      res.status(200).json({ message: "No videos found for this user." });
    } else {
      res.status(200).json(videosResponse?.data?.items);
    }
  } catch (error) {
    console.error("Error fetching user videos:", error);
    res.status(400).json({ error: error.message });
  }
};

exports.likeVideo = async (req, res) => {
  const { videoId } = req.body;
  try {
    const youtube = google.youtube({ version: "v3", auth: oauth2Client });
    await youtube.videos.rate({
      id: videoId,
      rating: "like",
    });
    res.status(200).json({ message: "Video liked successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
