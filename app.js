var express = require('express');
var https = require('https');
var app = express();

var KEY = process.env.SEARCHAPIKEY;
var CSE = process.env.CSE;
var API = "https://www.googleapis.com/customsearch/v1?key=" + KEY + "&cx=" + CSE + "&searchType=image&q=";

app.get('/:terms?', function (req, res) {
    var options = API + req.params.terms;

    if (req.query.offset > 0) {
        const offset = "&start=" + req.query.offset;
        options += offset;
    } 

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
