require("dotenv").config();
const express = require("express");
const youtubeRoutes = require("./src/routes/youtubeRoutes");

const app = express();
app.use(express.json());

// YouTube API Routes
app.use("/api/v1", youtubeRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


