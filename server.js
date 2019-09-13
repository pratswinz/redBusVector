var express = require("express");
var request = require('request');
var app = express();

app.use(express.static('public'));
 
//make way for some custom css, js and images
app.use('/css', express.static(__dirname + '/public/css'));
app.use('/js', express.static(__dirname + '/public/js'));
app.use('/images', express.static(__dirname + '/public/images'));

app.use('/api/board', function(req, res){
    let url = '/api/leaderboard';
    request('url', function(error, response, body) {
        res.json(body)
    });
});
 
var server = app.listen(5010, function(){
    var port = server.address().port;
    console.log("Server started at http://localhost:%s", port);
});