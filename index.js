import express from 'express';
import { loadAdsData, retrieveCachedData } from './ads-cache/ads.js';
const PORT = process.env.PORT || 5000;
const REDIS_PORT = process.env.PORT || 6379;
const app = express();
 
app.get("/cached", async (req, res) => {
    const data = await retrieveCachedData()
    res.json(data);
})

// start express server at 5000 port
app.listen(5000, async () => {
    loadAdsData();
});
