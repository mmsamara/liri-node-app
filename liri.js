//Code to read and set any environment variables with the dotenv package
require("dotenv").config();

//Variables allowing us to use all external files & packages
var keys = require("./keys.js");
var Spotify = require("node-spotify-api");
var Twitter = require("twitter");
var request = require("request");
var fs = require("fs");

//Variables used to access keys info from the keys.js file
var spotifyClient = new Spotify(keys.spotify);
var twitterClient = new Twitter(keys.twitter);

//Takes in first user arg to figure out which function to run
var argument = process.argv[2];

//Initializing movie/ song variables and setting them equal to arrays starting at the index of 3
var movieName = "";
var song = "";

//Evaluates the argument var and comparing value to switch clauses, determining function
switch(argument) {
	case "my-tweets":
		showTweets();
		break;
	case "spotify-this-song":
		//Checks if no second argument was provided and if so, gives song info for the "The Sign" 
		if (!process.argv[3]) {
			song = "The Sign";
		} else {
			//Set "song" to the command line arguments array starting at index 3, then covert it to a string of all its elements combined
			song = process.argv.slice(3).join(" ");	
		}
		showSongInfo();
		break;
	case "movie-this":
		//Checks if no second argument was provided and if so, returns movie info for "Mr. Nobody"
		if (!process.argv[3]) {
			movieName = "Mr. Nobody";
		} else {
			//Set "movieName" to the command line arguments array starting at index 3, then covert it to a string of all its elements combined
			movieName = process.argv.slice(3).join(" ");		
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
	//Uses fs package to read from the random.txt file
	fs.readFile("random.txt", "utf8", function(error, data) {
		if (error) {return console.log(error)};

		//Take in the data from the fs call and split it up into an array separated by commas
		var dataArr = data.split(",");
		//Dynamically set the first arg based on the first item in file array
		argument = dataArr[0]
		//Run a function based on first and second items in the file
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
	//Build the OMDB url that we will send to the request package using movieName variable from above
	var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&apikey=trilogy"

	//Using "request" npm package to retrieve info from your queryUrl
	request(queryUrl, function (error, response, body) {
	  if (error) {return console.log('Error occurred: ' + error);}

	  //Take in the text from the queryUrl and convert it to a JSON object using JSON.parse
	  //Then use dot notation to print specified parts
	  console.log("--------------------------");
	  console.log("Title:       " + JSON.parse(body).Title);
	  console.log("Year:        " + JSON.parse(body).Year);
	  console.log("IMDB Rating: " + JSON.parse(body).imdbRating);
	  //console.log("RT Rating:   " + JSON.parse(body).Ratings[1].Value);
	  console.log("RT Rating:   " + JSON.parse(body).Metascore + "%");
	  console.log("Country:     " + JSON.parse(body).Country);
	  console.log("Language:    " + JSON.parse(body).Language);
	  console.log("Plot:        " + JSON.parse(body).Plot);
	  console.log("Actors:      " + JSON.parse(body).Actors);
	  console.log("--------------------------");
	});
}

function showSongInfo() {
	//Runs node-spotify-api npm package
	spotifyClient.search({ type: 'track', query: song }, function(err, data) {
	  if (err) {
	  	return console.log('Error occurred: ' + err);
	  }

	  //Print song information to the console
	  console.log("--------------------------");
	  console.log(data.tracks.items[0].album.artists[0].name);
	  console.log(data.tracks.items[0].name);  
	  console.log(data.tracks.items[0].album.href);
	  console.log(data.tracks.items[0].album.name);
	  console.log("--------------------------");
	  });
}

function showTweets() {

	var params = {screen_name: "Samara_SSB"};

	//Use "twitter" npm package to print my tweets
	twitterClient.get('statuses/user_timeline', params, function(error, tweets, response) {
		if (error) {
			console.log(error);
		}

		for (var i = 0; i < 20; i++){
			console.log("--------------------------");
			console.log(tweets[i].text);
			console.log(tweets[i].created_at);
		}
	});
}