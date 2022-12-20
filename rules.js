import needle from "needle";
import dotenv from 'dotenv'
dotenv.config()

const token = process.env.TWITTER_BEARER_TOKEN;
const options = {
    headers: {
		'Authorization': `Bearer ${token}`,
		'Content-Type': 'application/json',
	}
};

// Create Rule(s)
const body = JSON.stringify({
    "add": [
        {
            "value": "@GenesysTheBot #GenesysTheBot -has:links",
            "tag": "tweets that mention the bot"
        }
    ]
});
needle('post', 'https://api.twitter.com/2/tweets/search/stream/rules', options, function (error, response) {
	if (error) throw new Error(error);
	console.log(response.body);
});


// Get Rules
needle('get', 'https://api.twitter.com/2/tweets/search/stream/rules', options, function (error, response) {
	if (error) throw new Error(error);
	console.log(response.body);
});


// Delete Rule(s)
const deleteBody = JSON.stringify({
	"delete": {
		"ids": [
			"1595909425763872768"
		]
	}
});
needle('post', 'https://api.twitter.com/2/tweets/search/stream/rules', deleteBody, options, function (error, response) {
	if (error) throw new Error(error);
	console.log(response.body);
});

