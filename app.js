var express = require('express');
var app = express();

app.set('port', process.env.PORT || 8080);

app.use(express.static('./'));
app.use(require('./index.js'));

var server = app.listen(app.get('port'), function () {
    console.log("listening on port " + app.get('port'));
});
