require("dotenv").config();

var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var request = require('request');
var fs = require('fs');
var keys = require('./keys.js');

// console.log(keys);


if (process.argv[2] === "my-tweets") {
    myTweets();

}

function myTweets() {



    var client = new Twitter(keys.twitter);

    var params = {
        screen_name: 'seyiCode',
        count: 20
    };

    client.get('statuses/user_timeline', params, function (err, tweets, response) {
            if (!err) {
                for (var i = 0; i < tweets.length; i++) {

                    console.log("Tweet:");
                    console.log(tweets[i].text);

                    console.log("Date Created:");
                    console.log(tweets[i].created_at);

                    console.log("--------------------------------------------------");
        

                    fs.appendFile("log.txt",
                        "Tweet: " + tweets[i].text + 
                        "\n--------------------------------------------------\n" +
                            "Date Created: " + tweets[i].created_at +
                            "\n--------------------------------------------------\n",
                        function (err) {
                            if (err) {
                                return console.log(err);
                            };
                            console.log("log.txt was updated with Twitter Info!");
            
                        });
                }
              

                }
         
            });

          
        }


    if (process.argv[2] === "spotify-this-song") {
        spotifyThisSong();

    }

    function spotifyThisSong(title) {

        //create a variable for the output that the user puts in that'll accept multiple words
        var output = "";
        for (var i = 3; i < process.argv.length; i++) {
            output += process.argv[i] + " ";
        };

        if (title) {
            var songTitle = title;
        } else {
            var songTitle = output ? output : "'The Sign' by Ace of Base";
        }

        console.log(output)

        // authenticates spotify api
        var spotify = new Spotify(keys.spotify);

        spotify.search({
            type: 'track',
            query: songTitle
        }, function (err, data) {
            if (err) {
                return console.log('Error occurred: ' + err);
            }

            // stores larger object (data) from Spotify
            // console.log(data.tracks.items[0]);

            var songInfo = data.tracks.items;

            // loops through object
            for (var i = 0; i < songInfo.length; i++) {

                var albumName = songInfo[i].album.name;
                var artistName = songInfo[i].artists[0].name;
                var preview = songInfo[i].album.external_urls.spotify
                var songName = songInfo[i].name;
                // console.log(songInfo);

                // Prints artist info to the console
                console.log("Song Title: " + songName + "\nArtist(s): " + artistName + "\nAlbum: " + albumName);

                if (preview === null) {
                    console.log("Unfortunately, It appears a preview url cannot be found. Perhaps you may want to try Youtube?");
                } else {
                    console.log("Song Preview: " + preview);
                };
                console.log("-----------------------------------------");
            };

            fs.appendFile("log.txt", (
                "\nSong Title: " + songName +
                "\nArtist(s): " + artistName +
                "\nAlbum: " + albumName +
                "\nSong Preview: " + preview +
                "\n--------------------------------------------------"), function (err) {
                if (err) {
                    return console.log(err);
                };
                console.log("log.txt was updated with Song Info!");

            });

        });
    }


    if (process.argv[2] === "movie-this") {
        movieThis();
    }

    function movieThis(title) {


        var output = "";
        for (var i = 3; i < process.argv.length; i++) {
            output += process.argv[i] + " ";
        }


        if (title) {
            var movieName = title;
        } else {
            var movieName = output ? output : "Mr. Nobody";
        }
        console.log(output);

        var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy"
        // console.log(queryUrl);

        // use request to retrieve info
        request(queryUrl, function (error, response, body) {

            if (error) {
                return console.log("Error Occured: " + error);
            }

            if (!error && response.statusCode === 200) {

                //store movie properties and values into a variable 

                var movieTitle = JSON.parse(body).Title;
                var movieRelease = JSON.parse(body).Year;
                var movieActors = JSON.parse(body).Actors;
                var movieLanguage = JSON.parse(body).Language;
                var movieCountry = JSON.parse(body).Country;
                var movieSynopsis = JSON.parse(body).Plot;
                var imdbRating = JSON.parse(body).imdbRating;
                var rTRating = JSON.parse(body).Ratings[1].Value;

                //console log the movie data properties and values in one line to minimize errors

                console.log("Movie Title: " + movieTitle + "\nMovie Released In: " +
                    movieRelease + "\nActors: " + movieActors + "\nLanguage(s) of Movie: " +
                    movieLanguage + "\nCountry Movie Was Produced In: " + movieCountry +
                    "\nSynopsis: " + movieSynopsis + "\nThis Movie's IMDB Rating Is: " +
                    imdbRating + "\nThis Movie's Rotten Tomatoes Rating Is: " + rTRating);

                // Break points between movie data
                console.log("--------------------------------------");

                fs.appendFile("log.txt", (
                    "Movie Title: " + movieTitle + "\nMovie Released In: " +
                    movieRelease + "\nActors: " + movieActors + "\nLanguage(s) of Movie: " +
                    movieLanguage + "\nCountry Movie Was Produced In: " + movieCountry +
                    "\nSynopsis: " + movieSynopsis + "\nThis Movie's IMDB Rating Is: " +
                    imdbRating + "\nThis Movie's Rotten Tomatoes Rating Is: " + rTRating +
                    "\n--------------------------------------------------"), function (err) {
                    if (err) {
                        return console.log(err);
                    };
                    console.log("log.txt was updated with Movie Info!");

                });

            }
        })

    }

    if (process.argv[2] === "do-what-it-says") {

        fs = require('fs');

        //read file is a method that contains a variable and a function.
        //the function will either return an error and the data from the file.
        fs.readFile("random.txt", "utf8", function (err, data) {

            if (err) {
                return console.log(err);
            }

            console.log('OK: ' + "random.txt");
            console.log(data);

            //separate the data contents by comma
            var dataArray = data.split(",");

            if (dataArray[0] === "spotify-this-song") {
                spotifyThisSong(dataArray[1]);

            }

            if (dataArray[0] === "my-tweets") {
                myTweets();

            }

            if (dataArray[0] === "movie-this") {
                movieThis(dataArray[1]);

            }
        });
    };
