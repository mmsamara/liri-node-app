require("dotenv").config();

var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

var argument = process.argv[2];

switch(argument) {
	case "my-tweets":

		break;
	case "spotify-this-song":

		break;
	case "movie-this":

		break;
	case "do-what-it-says":

		break;
	default:
		console.log("Enter a valid command");

}