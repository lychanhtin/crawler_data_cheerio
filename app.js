var express = require("express");
var app = express();
app.get('/', function (req, res) {
    res.send('Setup ExpressJs');
})

app.listen(3000, function () {
    console.log('App listening on port 3000')
})

