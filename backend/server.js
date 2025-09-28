// backend/server.js
import express from 'express';
import cors from 'cors';
import { TwitterApi } from 'twitter-api-v2';

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

// --- Twitter client using hardcoded keys (OAuth 1.0a User Context) ---
const twitterClient = new TwitterApi({
  appKey: 'YnFtd6vYi2eS8Vwf5jgqbSLzJ',        // Replace with your Consumer API Key
  appSecret: 'i6WnLS1tEccVEFwiKV2lZOO3N81gkBuXjVPfq4AjS697Re47Vd',  // Replace with your Consumer API Secret
  accessToken: '1968356119220293633-G815W4Ugz2z62pHscwOl9oDtaZJXuZ',   // Replace with your Access Token
  accessSecret: 'xu7ftMW2YpGMAbfdgs8sxlxBevtw3gd90GUiWR0JPsblQ'  // Replace with your Access Token Secret
});

// Get the v2 client
const rwClient = twitterClient.readWrite;

// --- Test route ---
app.get('/test-connection', (req, res) => {
  res.json({ success: true, message: 'Backend is running!' });
});

// --- Post job to X (Twitter) ---
app.post('/post-job', async (req, res) => {
  try {
    const { text } = req.body;

    // Post tweet
    const tweet = await rwClient.v2.tweet(text);

    res.json({ success: true, data: tweet });
  } catch (err) {
    console.error('Error posting tweet:', err);
    res.json({ success: false, error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
