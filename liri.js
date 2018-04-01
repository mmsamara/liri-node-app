require("dotenv").config();

var keys = require("./keys.js");
var Spotify = require("node-spotify-api");
var Twitter = require("twitter");
var request = require("request");
var fs = require("fs");

var spotifyClient = new Spotify(keys.spotify);
var twitterClient = new Twitter(keys.twitter);

var argument = process.argv[2];

var movieName = "";
var song = "";

switch(argument) {
	case "my-tweets":
		showTweets();
		break;
	case "spotify-this-song":
		if (process.argv[3] === undefined) {
			song = "The Sign";
		} else {
			song = process.argv[3];		
		}
		showSongInfo();
		break;
	case "movie-this":
		if (process.argv[3] === undefined) {
			movieName = "Mr. Nobody";
		} else {
			movieName = process.argv[3];		
		}
		showMovieInfo();
		break;
	case "do-what-it-says":
		doLiri();
		break;
	default:
		console.log("Enter a valid command");

}

function doLiri() {
	fs.readFile("random.txt", "utf8", function(error, data) {
		if (error) {return console.log(error)};

		var dataArr = data.split(",");
		argument = dataArr[0]
		switch(argument) {
			case "my-tweets":
				showTweets();
				break;
			case "spotify-this-song":
				song = dataArr[1];
				showSongInfo();
				break;
			case "movie-this":
				movieName = dataArr[1];
				showMovieInfo();
				break;
			case "do-what-it-says":
				doLiri();
				break;
			default:
				console.log("Enter a valid command");
		}
	});

}

function showMovieInfo() {
	var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&apikey=trilogy"

	request(queryUrl, function (error, response, body) {
	  if (error) {
	    return console.log('Error occurred: ' + error);
	  }
	  console.log("Title:       " + JSON.parse(body).Title);
	  console.log("Year:        " + JSON.parse(body).Year);
	  console.log("IMDB Rating: " + JSON.parse(body).Ratings[0].Value);
	  console.log("RT Rating:   " + JSON.parse(body).Ratings[1].Value);
	  console.log("Country:     " + JSON.parse(body).Country);
	  console.log("Language:    " + JSON.parse(body).Language);
	  console.log("Plot:        " + JSON.parse(body).Plot);
	  console.log("Actors:      " + JSON.parse(body).Actors);
	});
}

function showSongInfo() {

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
	console.log(process.argv.length);
	console.log(song);
	});
}

function showTweets() {
	twitterClient.get('statuses/user_timeline', {screen_name: 'thebigsamara'}, function(error, tweets, response) {
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