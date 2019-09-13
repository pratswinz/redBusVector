const express = require("express");
const bodyParser = require('body-parser');
const apiRouter = require("./routes");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api", apiRouter);
 
app.use(express.static('public'));

//make way for some custom css, js and images
app.use('/css', express.static(__dirname + '/public/css'));
app.use('/js', express.static(__dirname + '/public/js'));
app.use('/images', express.static(__dirname + '/public/images'));

 
const server = app.listen(5010, function(){
    const port = server.address().port;
    console.log("Server started at http://localhost:%s", port);
});