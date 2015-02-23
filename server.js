var config      = require('./config.json');

var express     = require('express');
var app         = express();
var serveStatic = require('serve-static');
var extract     = require('./extract.js');

app.use(serveStatic('client/', {'index': ['index.html']}));

var service = require('./service.js');

require('./router.js')(app, service);

exports.start = function() {
  app.listen(config.server.port);
  setTimeout(extract, 1000*60*60*24);
};
