//Défi - Soixante Circuits - Corentin Burguiere le 16 février 2022

require('dotenv').config();

const express = require('express');
const app = express();
const http = require("http");
const https = require("https");

const { Server } = require("socket.io");
const port = process.env.PORT;
const server = http.createServer(app);
const io = new Server(server);

//Waiting time before change city (in milliseconds)
var waitTime = process.env.WAIT_TIME;
var seconds = waitTime / 1000;

app.use('/', express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

server.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`)
})

//API's options
    const options = {
        "method": "GET",
        "hostname": "community-open-weather-map.p.rapidapi.com",
        "port": null,
        "path": "/weather?",
        "headers": {
            "x-rapidapi-host": "community-open-weather-map.p.rapidapi.com",
            "x-rapidapi-key": process.env.API_KEY,
            "useQueryString": true
        }
    };

//Choose a random city of the list
function villeAleatoire() {
    //Init the link, then choose the city randomly
    options.path = "/weather?";
    var cityList = ["Paris", "London", "Tokyo", "New+York+City", "Moscow", "Nantes", "Florence", "Belgrade", "Madrid", "Berlin", "Cologne", "Amsterdam", "Los+Angeles", "Inuvik", "Barrow", "Mould+Bay", "Anadyr", "Seoul", "Sendai", "Singapore"];
    var size = cityList.length - 1;
    var random = randomIntFromInterval(0, size);

    //Create URL with the city
    var URLcity = cityList[random];
    options.path = options.path + "q=" + URLcity + "&lang=fr";
        console.log(options.path);
    }

function randomIntFromInterval(min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min)
}

//Do once to not get a empty page at the start
villeAleatoire(); 

io.on('connection', (socket) => {

    //Send the seconds to the client
    seconds = waitTime / 1000;
    socket.emit('chrono', seconds);
    
    var req = https.request(options, function (res) {
        var chunks = [];

       res.on("data", function (chunk) {
                chunks.push(chunk);
            });

            res.on("end", function () {
                var body = Buffer.concat(chunks);

                var parsedData = JSON.parse(body);
                //Uncommented to see all data on the console
                console.log(parsedData);

                //Collect data on the parsedData
                city = parsedData.name;
                meteo = parsedData.weather[0].main;
                desc = parsedData.weather[0].description;
                temp = parsedData.main.temp;

                //Converter on C°
                let cel = temp - 273.15;
                cel=(Math.round(cel * 100) / 100).toFixed(2);

                console.log("Ville : " + city);
                console.log("Météo actuelle : " + meteo);
                console.log("Description : " + desc);
                console.log("Température : " + cel);
                console.log("-----------------------------");

                //Send information to client
                data = [city, meteo, desc, cel];
                socket.emit('afficherMeteo', data);
            });
        });
        req.end();


//Search a new city every 30 secondes
    var interval = setInterval(function () {

        villeAleatoire();

        //Get information from the API
        var req = https.request(options, function (res) {
            var chunks = [];

           res.on("data", function (chunk) {
                chunks.push(chunk);
           });

            res.on("end", function () {
                var body = Buffer.concat(chunks);
                var parsedData = JSON.parse(body);

                //Uncommented to see all data on the console
                console.log(parsedData);

                //Collect data on the parsedData
                city = parsedData.name;
                meteo = parsedData.weather[0].main;
                desc = parsedData.weather[0].description;
                temp = parsedData.main.temp;

                //Converter on C°
                let cel = temp - 273.15;
                cel = (Math.round(cel * 100) / 100).toFixed(2);

                console.log("Ville : " + city);
                console.log("Météo actuelle : " + meteo);
                console.log("Description : " + desc);
                console.log("Température : " + cel);
                console.log("-----------------------------");

                //Send information to client
                data = [city, meteo, desc, cel];
                seconds = waitTime / 1000;
                socket.emit('afficherMeteo', data);
            });
        });

        io.on('close', function close() {
        clearInterval(interval);
        });

        req.end();

    }, waitTime);


    //Chronometre
    var interval = setInterval(function () {

        //Decrement time
        seconds--;

        if (seconds < 0) {
            seconds = waitTime / 1000;

            //Send the seconds to the client
            socket.emit('afficherMeteo', data);
        }
        else {
            console.log("Une seconde est passée..." + seconds);

            //Send the seconds to the client
            socket.emit('chrono', seconds);
        }

        io.on('close', function close() {
            clearInterval(interval);
        });

        socket.on('disconnect', () => {
            console.log('user disconnected');
        });

    }, 1000);
});

module.exports = app;
