import { TwitterApi, ETwitterStreamEvent } from "twitter-api-v2"
import { config } from "./config"

// export const getRecentTweets = async (twitter: TwitterApi, hashtags: string[]) => {
//     const tweets: Tweet[] = []

//     for (const hashtag of hashtags) {
//         const response = await twitter.v2.searchRecentTweets(`#${hashtag}`)

//         tweets.push(...response.data)
//     }

//     return tweets
// }

export const streamTweets = async (twitterClient: TwitterApi) => {
    // Get and delete old rules if needed
    const rules = await twitterClient.v2.streamRules()
    if (rules.data?.length) {
        await twitterClient.v2.updateStreamRules({
            delete: { ids: rules.data.map((rule) => rule.id) },
        })
    }

    // Add our rules
    await twitterClient.v2.updateStreamRules({
        add: [{ value: "ukraine" }, { value: "iran" }],
    })

    const stream = await twitterClient.v2.searchStream({
        "tweet.fields": ["referenced_tweets", "author_id"],
        expansions: ["referenced_tweets.id"],
    })
    // Enable auto reconnect
    stream.autoReconnect = true

    stream.on(ETwitterStreamEvent.Data, async (tweet) => {
        console.log(tweet)

        // Ignore RTs or self-sent tweets
        const isARt =
            tweet.data.referenced_tweets?.some((tweet) => tweet.type === "retweeted") ?? false
        if (isARt || tweet.data.author_id === config.userId) {
            return
        }

        // // Reply to tweet
        // await twitterClient.v1.reply("", tweet.data.id)
    })
}
