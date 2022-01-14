import express from 'express';
import cors from 'cors';
import bodyParser from "body-parser";
import { run, retrieveCachedData, getRandomAdd } from './src/AdService.js';
const app = express();
const ads = express();

app.use(cors())
app.use(bodyParser.json())
app.use('/ads', ads)

ads.get("/fetch", async (req, res) => {
    const data = await getRandomAdd(2)
    res.json(data);
})

ads.get("/cached", async (req, res) => {
    const data = await retrieveCachedData()
    res.json(data);
})

app.listen(process.env.PORT || 3000, async () => {
    run()
});
