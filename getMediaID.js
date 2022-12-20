import OAuth from 'oauth-1.0a'
import { createHmac } from 'crypto'
import needle from 'needle'
import * as querystring from 'query-string'
import dotenv from 'dotenv'
dotenv.config()

async function getMediaID(media_data) {
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

    const authHeader = oauth.authorize({
        url: 'https://upload.twitter.com/1.1/media/upload.json',
        method: 'POST',
        data: {
            media_data
        }
    }, token);

    const options = {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    };

    try {
        const response = await needle('post', 'https://upload.twitter.com/1.1/media/upload.json', querystring.stringify(authHeader), options)
        console.log(response.body)
        return response.body.media_id_string
    } catch (err) {
        console.log(err)
        return err
    }
    /* 
        response.body
        {
            media_id: 1597362226301915100,
            media_id_string: '1597362226301915136',
            size: 787271,
            expires_after_secs: 86400,
            image: { image_type: 'image/png', w: 512, h: 512 }
        }
    */
}
export { getMediaID };