require("dotenv").config();

var keys = require("./keys.js");

var Spotify = require("node-spotify-api");
var spotify = new Spotify(keys.spotify);

var moment = require("moment");

var axios = require("axios");

var doThis = process.argv[2];
var searchTerm = process.argv.slice(3).join(" ");

var divider = "\n------------------------------------------------------------\n\n";

switch (doThis) {
    case "spotify-this-song":
        spotifySong();
        break;

    case "concert-this":
        concerts();
        break;

    case "movie-this":
        movies();
        break;
}

function spotifySong() {
    if (searchTerm === "") {
        searchTerm = "the sign"
    }
    spotify.search({
        type: "track",
        query: searchTerm
    }, function (err, data) {
        if (err) {
            return console.log("Error: " + err);
        }
        var artist = data.tracks.items[0].artist[0].name;
        var songTitle = data.tracks.items[0].name;
        var preview = data.tracks.items[0].album.preview_url;
        var albumName = data.tracks.items[0].album.name;

        var output = divider +
            "\nArtist: " + artist +
            "\nSong Title: " + songTitle +
            "\nPreview: " + preview +
            "\nAlbum: " + albumName +
            divider;

        console.log(output);
    });
}

function concerts() {

    axios
        .get("https://rest.bandsintown.com/artists/" + searchTerm + "/events?app_id=codingbootcamp")
        .then(function (response) {
            var venueName = response.data[0].venue.name;
            var venueLocation = response.data[0].venue.city + ", " + response.data[0].venue.country;
            var date = moment(reponse.data[0].datetime).format("MM/DD/YYYY");
            var output = divider +
                "\nVenue: " + venueName +
                "\nVenue Location: " + venueLocation +
                "\nDate: " + date +
                divider;

            console.log(output);
        })
        .catch(function (error) {
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                console.log(error.response.data);
                console.log(error.response.status);
                console.log(error.response.headers);
            } else if (error.request) {
                // The request was made but no response was received
                // `error.request` is an object that comes back with details pertaining to the error that occurred.
                console.log(error.request);
            } else {
                // Something happened in setting up the request that triggered an Error
                console.log("Error", error.message);
            }
            console.log(error.config);
        });
}

function movies() {
    if (searchTerm === "") {
        var ifYou = "If you haven't watched " + "Mr. Nobody," + " then you should: http://www.imdb.com/title/tt0485947/"
        var netFlix = "It's on Netflix!"
        var output = ifYou +
            "\n" + netFlix;

        console.log(output);
    }
    var movie = Array.prototype.join.call(searchTerm, "+");
    axios
        .get("http://omdbapi.com/?apikey=trilogy&t=" + movie)
        .then(function (response) {
            var title = response.Title;
            var year = response.data.Year;
            var rating = response.data.imdbRating;
            // var rottenTomatoes = JSON.stringify(response.data.Ratings[1]);
            var country = response.data.Country;
            var language = response.data.Language;
            var plot = response.data.Plot;
            var actors = response.data.Actors;

            var output = divider +
                "\nTitle of Movie: " + title +
                "\nYear of Release: " + year +
                "\nIMDB Rating: " + rating +
                // "\nRotten Tomatoes Rating: " + rottenTomatoes +
                "\nCountry: " + country +
                "\nLanguage: " + language +
                "\nPlot: " + plot +
                "\nActors: " + actors +
                divider;

            console.log(output);
        })
}