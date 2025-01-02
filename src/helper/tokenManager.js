const tokens = {};

// Fetch stored tokens
const getTokens = async () => await tokens;

// Save access token
const saveAccessToken = async (accessToken) => {
  tokens.access_token = accessToken;
};

// Save refresh token
const saveRefreshToken = async (refreshToken) => {
  tokens.refresh_token = refreshToken;
};

module.exports = { getTokens, saveAccessToken, saveRefreshToken };
