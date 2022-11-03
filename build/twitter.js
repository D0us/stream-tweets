"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.streamTweets = void 0;
const twitter_api_v2_1 = require("twitter-api-v2");
const config_1 = require("./config");
// export const getRecentTweets = async (twitter: TwitterApi, hashtags: string[]) => {
//     const tweets: Tweet[] = []
//     for (const hashtag of hashtags) {
//         const response = await twitter.v2.searchRecentTweets(`#${hashtag}`)
//         tweets.push(...response.data)
//     }
//     return tweets
// }
const streamTweets = (twitterClient) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    // Get and delete old rules if needed
    const rules = yield twitterClient.v2.streamRules();
    if ((_a = rules.data) === null || _a === void 0 ? void 0 : _a.length) {
        yield twitterClient.v2.updateStreamRules({
            delete: { ids: rules.data.map((rule) => rule.id) },
        });
    }
    // Add our rules
    yield twitterClient.v2.updateStreamRules({
        add: [{ value: "ukraine" }, { value: "iran" }],
    });
    const stream = yield twitterClient.v2.searchStream({
        "tweet.fields": ["referenced_tweets", "author_id"],
        expansions: ["referenced_tweets.id"],
    });
    // Enable auto reconnect
    stream.autoReconnect = true;
    stream.on(twitter_api_v2_1.ETwitterStreamEvent.Data, (tweet) => __awaiter(void 0, void 0, void 0, function* () {
        var _b, _c;
        console.log(tweet);
        // Ignore RTs or self-sent tweets
        const isARt = (_c = (_b = tweet.data.referenced_tweets) === null || _b === void 0 ? void 0 : _b.some((tweet) => tweet.type === "retweeted")) !== null && _c !== void 0 ? _c : false;
        if (isARt || tweet.data.author_id === config_1.config.userId) {
            return;
        }
        // // Reply to tweet
        // await twitterClient.v1.reply("", tweet.data.id)
    }));
});
exports.streamTweets = streamTweets;
