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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _a;
exports.__esModule = true;
// find recent twitter posts with hashtags and reply to them
var twitter_api_v2_1 = require("twitter-api-v2");
// OAuth 1.0a (User context)
var twitterClient = new twitter_api_v2_1.TwitterApi({
    appKey: "consumerAppKey",
    appSecret: "consumerAppSecret",
    // Following access tokens are not required if you are
    // at part 1 of user-auth process (ask for a request token)
    // or if you want a app-only client (see below)
    accessToken: "accessOAuthToken",
    accessSecret: "accessOAuthSecret"
});
var myUserId = "123123";
// // Instantiate with desired auth type (here's Bearer v2 auth)
// const twitterClient = new TwitterApi("<YOUR_APP_USER_TOKEN>")
// Tell typescript it's a readonly app
var readOnlyClient = twitterClient.readWrite;
// Get and delete old rules if needed
var rules = await twitterClient.v2.streamRules();
if ((_a = rules.data) === null || _a === void 0 ? void 0 : _a.length) {
    await twitterClient.v2.updateStreamRules({
        "delete": { ids: rules.data.map(function (rule) { return rule.id; }) }
    });
}
// Add our rules
await twitterClient.v2.updateStreamRules({
    add: [{ value: "ukraine" }, { value: "iran" }]
});
var stream = await twitterClient.v2.searchStream({
    "tweet.fields": ["referenced_tweets", "author_id"],
    expansions: ["referenced_tweets.id"]
});
// Enable auto reconnect
stream.autoReconnect = true;
stream.on(twitter_api_v2_1.ETwitterStreamEvent.Data, function (tweet) { return __awaiter(void 0, void 0, void 0, function () {
    var isARt;
    var _a, _b;
    return __generator(this, function (_c) {
        isARt = (_b = (_a = tweet.data.referenced_tweets) === null || _a === void 0 ? void 0 : _a.some(function (tweet) { return tweet.type === "retweeted"; })) !== null && _b !== void 0 ? _b : false;
        if (isARt || tweet.data.author_id === myUserId) {
            return [2 /*return*/];
        }
        return [2 /*return*/];
    });
}); });
// config()
// const twitter = new Twitter({
//     appKey: process.env.TWITTER_API_KEY,
//     appSecret: process.env.TWITTER_API_SECRET,
//     accessToken: process.env.TWITTER_ACCESS_TOKEN,
//     accessSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
// })
// const hashtags = readFileSync(join(__dirname, "hashtags.txt"), "utf-8").split("")
// ;(async () => {
//     const tweets = await getRecentTweets(twitter, hashtags)
//     await replyToTweets(twitter, tweets)
// })()
