import needle from 'needle';
import dotenv from 'dotenv'
dotenv.config()

import { tweet } from './tweet.js';
import { generateImage } from './generateImage.js'
import {getMediaID} from './getMediaID.js'
const token = process.env.TWITTER_BEARER_TOKEN;

function streamConnect(retryAttempt) {

    const stream = needle.get('https://api.twitter.com/2/tweets/search/stream', {
        headers: {
            "User-Agent": "v2FilterStreamJS",
            "Authorization": `Bearer ${token}`
        },
        timeout: 20000
    });

    stream.on('data', async data => {
        try {
            const json = JSON.parse(data);
            console.log(json);

            let prompt = null;
            let text = json.data.text;
            if (text.includes(`“`)) {
                prompt = text.match(/\“.+?\”/g)
            } else {
                prompt = text.match(/\".+?\"/g)
            }
            prompt = prompt[0];
            prompt = prompt.slice(1, -1);
            console.log(prompt)

            const tweet_id = json.data.id
            const media_data = await generateImage(prompt)
            if(media_data[0]) {
                const media_id = await getMediaID(media_data[0])
                tweet(prompt, tweet_id, media_id)
            }
            else {
                tweet(media_data[1], tweet_id, null)
            }
            // A successful connection resets retry count.
            retryAttempt = 0;
        } catch (e) {
            if (data.detail === "This stream is currently at the maximum allowed connection limit.") {
                console.log(data.detail)
                process.exit(1)
            } else {
                // Keep alive signal received. Do nothing.
            }
        }
    }).on('err', error => {
        if (error.code !== 'ECONNRESET') {
            console.log(error.code);
            process.exit(1);
        } else {
            // This reconnection logic will attempt to reconnect when a disconnection is detected.
            // To avoid rate limits, this logic implements exponential backoff, so the wait time
            // will increase if the client cannot reconnect to the stream. 
            setTimeout(() => {
                console.warn("A connection error occurred. Reconnecting...")
                streamConnect(++retryAttempt);
            }, 2 ** retryAttempt)
        }
    });

    return stream;
}

(async () => {
    // Listen to the stream.
    streamConnect(0);
})();   