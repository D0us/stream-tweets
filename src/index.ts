// find recent twitter posts with hashtags and reply to them
import { TwitterApi } from "twitter-api-v2"
import { streamTweets } from "./twitter"

require("dotenv").config()

const bearerToken = process.env.BEARER_TOKEN ? process.env.BEARER_TOKEN : ""
const apiKey = process.env.API_KEY ? process.env.API_KEY : ""
const apiSecret = process.env.API_SECRET ? process.env.API_SECRET : ""

// Bearer v2 auth
const twitterClient = new TwitterApi(bearerToken)

const readWriteClient = twitterClient.readOnly

streamTweets(twitterClient)
    .then(() => {
        setTimeout(() => {
            console.log("Finished")
            process.exit(0)
        }, 20000)
    })
    .catch((e) => {
        console.log(`Error: ${e}`)
        process.exit(1)
    })
