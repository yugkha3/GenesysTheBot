import {Configuration, OpenAIApi} from 'openai'
import dotenv from 'dotenv'
dotenv.config()

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY
});

const openai = new OpenAIApi(configuration)

async function generateImage(prompt) {
    try {
        const result = await openai.createImage({
            prompt,
            n: 1,
            size: '512x512',
            response_format: 'b64_json'
        })
        return [result.data.data[0].b64_json, null]
        /*
            result
            {
                "created": 1589478378,
                "data": [
                    {
                        "b64.json": "data"
                    }
                ]
            }
        */
    } catch (err) {
        return [null, err.response.data.error.message]
    }
}

export { generateImage };
