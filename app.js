var express = require('express');
var https = require('https');
var app = express();

var KEY = process.env.SEARCHAPIKEY;
var CSE = process.env.CSE;
var API = "https://www.googleapis.com/customsearch/v1?key=" + KEY + "&cx=" + CSE + "&searchType=image&q=";
var results;


app.get('/:queryTerms?', function (req, res) {
    const options = API + req.params.queryTerms;

    callback = function(response) {
        var data= '';

        response.on('data', function (chunk) {
            data += chunk;
        });

        response.on('end', function () {
            var results = JSON.parse(data).items;

            var formattedResults = results.map(function(obj) {
              return {
                url: obj.link,
                snippet: obj.snippet,
                thumbnail: obj.image.thumbnailLink,
                context: obj.image.contextLink
              };
            })

            res.send(formattedResults);
        });
    }

    https.request(options, callback).end();
})

app.listen(process.env.PORT, function () {
  console.log('Image Search Server Started')
})
