require("dotenv").config();
var keys = require("./keys.js");

var Spotify = require("node-spotify-api");
var Twitter = require("twitter");
var spotifyClient = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

var argument = process.argv[2];

switch(argument) {
	case "my-tweets":
		showTweets();
		break;
	case "spotify-this-song":
		showSongInfo();
		break;
	case "movie-this":
		showMovieInfo();
		break;
	case "do-what-it-says":
		doText();
		break;
	default:
		console.log("Enter a valid command");

}

function showSongInfo() {
	var song = "happy";

	if (process.argv.length < 4) {
		song = "The Sign";
	} else {
		song = process.argv[3];		
	}

	spotifyClient.search({ type: 'track', query: song }, function(err, data) {
	  if (err) {
	    return console.log('Error occurred: ' + err);
	  }
	console.log("--------------------------");
	console.log(data.tracks.items[0].album.artists[0].name);
	console.log(data.tracks.items[0].name);  
	console.log(data.tracks.items[0].album.href);
	console.log(data.tracks.items[0].album.name);
	console.log("--------------------------");
	});
}

function showTweets() {
	client.get('statuses/user_timeline', {screen_name: 'thebigsamara'}, function(error, tweets, response) {
		if (error) {
			console.log(error);
		}

		console.log("TWEETS BY @thebigsamara");
		for (var i = 0; i < 20; i++){
			var myTweet = tweets[i].full_text;
			console.log("--------------------------");
			console.log(myTweet);
			//console.log("Tweeted on " + tweets[i].created_at);
			//console.log(JSON.stringify(tweets[i].text, null, 2));
			console.log("--------------------------");
		}
	});
}