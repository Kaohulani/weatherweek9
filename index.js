const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

// displays index.html of root path
app.get("/", function (req, res) {
    res.sendFile(__dirname + "/index.html")
});

// invoked after hitting go in the html form
app.post("/", function (req, res) {

  // Set default latitude and longitude for Hawaii
    const latitude = "20.97";
    const longitude = "-156.68";


    // build up the URL for the JSON query
    const units = "imperial";
    const apiKey = "873010304317811c87ca1b69b7854af9";
   const url = "https://api.openweathermap.org/data/2.5/weather?lat=" + latitude + "&lon=" + longitude + "&units=" + units + "&APPID=" + apiKey;

    // this gets the data from Open WeatherAPI
    https.get(url, function (response) {
        console.log(response.statusCode);

        // gets individual items from Open Weather API
        let data = '';
        response.on("data", function (chunk) {
            data += chunk;
        });

        response.on("end", function () {
            const weatherData = JSON.parse(data);
            const temp = weatherData.main.temp;
            const humidity = weatherData.main.humidity;
            const windSpeed = weatherData.wind.speed;
            const city = weatherData.name;
            const weatherDescription = weatherData.weather[0].description;
            const icon = weatherData.weather[0].icon;
          const cloudiness = weatherData.clouds.all;
            const imageURL = "http://openweathermap.org/img/wn/" + icon + "@2x.png";

            // displays the output of the results
            res.write("<h1> The weather is " + weatherDescription + "<h1>");
            res.write("<h2>The Temperature in " + city + " is " + temp + " Degrees Fahrenheit</h2>");
            res.write("<p>Humidity: " + humidity + "%</p>");
            res.write("<p>Wind Speed: " + windSpeed + " mph</p>");
          res.write("<p>Cloudiness: " + cloudiness + "%</p>")
            res.write("<img src=" + imageURL + ">");
            res.send();
        });
    });
});


// Code will run on 3000 or any available open port
app.listen(process.env.PORT || 3000, function () {
    console.log("Server is running on port");
});

