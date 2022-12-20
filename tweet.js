import OAuth from 'oauth-1.0a'
import { createHmac } from 'crypto'
import needle from 'needle'
import dotenv from 'dotenv'
dotenv.config()

function tweet(prompt, tweet_id, media_id) {
	const oauth = OAuth({
		consumer: {
			key: process.env.TWITTER_API_KEY,
			secret: process.env.TWITTER_API_KEY_SECRET
		},
		signature_method: 'HMAC-SHA',
		hash_function(base_string, key) {
			return createHmac('sha1', key)
				.update(base_string)
				.digest('base64')
		},
	})

	const token = {
		key: process.env.TWITTER_ACCESS_TOKEN,
		secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
	}
	
	let body;
	if(media_id === null) {
		body = JSON.stringify({
			"text": `Error (from DALL-E): ${prompt} \nTry some different prompt.`,
			"reply": { "in_reply_to_tweet_id": `${tweet_id}` },
		});
	} else {
		body = JSON.stringify({
			"text": `Image for prompt: ${prompt}, \nFollow me: https://twitter.com/GenesysTheBot`,
			"reply": { "in_reply_to_tweet_id": `${tweet_id}` },
			"media": {
				"media_ids": [`${media_id}`]
			}
		}); 
	}
	

	const authHeader = oauth.toHeader(oauth.authorize({
		url: 'https://api.twitter.com/2/tweets',
		method: 'POST',
	}, token));

	const options = {
		headers: {
			'Authorization': authHeader["Authorization"],
			'Content-Type': 'application/json',
		}
	};

	needle.post('https://api.twitter.com/2/tweets', body, options, function (error, response) {
		if (error) throw new Error(error);
		console.log(response.body);

		/*
			response
			{
				"body": {
    				"id": "1445880548472328192",
    				"text": "Are you excited for the weekend?"
  				}
			}
		*/
	})
}

export { tweet };