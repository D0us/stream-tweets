"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// find recent twitter posts with hashtags and reply to them
const twitter_api_v2_1 = require("twitter-api-v2");
const twitter_1 = require("./twitter");
require("dotenv").config();
const bearerToken = process.env.BEARER_TOKEN ? process.env.BEARER_TOKEN : "";
const apiKey = process.env.API_KEY ? process.env.API_KEY : "";
const apiSecret = process.env.API_SECRET ? process.env.API_SECRET : "";
// Bearer v2 auth
const twitterClient = new twitter_api_v2_1.TwitterApi(bearerToken);
const readWriteClient = twitterClient.readOnly;
(0, twitter_1.streamTweets)(twitterClient)
    .then(() => {
    setTimeout(() => {
        console.log("Finished");
        process.exit(0);
    }, 20000);
})
    .catch((e) => {
    console.log(`Error: ${e}`);
    process.exit(1);
});
