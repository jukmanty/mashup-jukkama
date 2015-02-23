var config = require('./config.json');
var dao = require('./dao.js');
var _ = require('lodash');
var http = require('http');
var xpath = require('xpath');
var dom = require('xmldom').DOMParser;

var extract = function() {
  _.forEach(config.extracts, function(conf) {
    http.get(conf.url, function(res) {
      var body = '';
      res.on('data', function(chunk) {
        body += chunk;
      });
      res.on('end', function() {
          var doc = new dom().parseFromString(body);
          var date = xpath.select(conf.xpath_date, doc).toString();
          // TODO: date formatting
          var price = xpath.select(conf.xpath_price, doc).toString();
          // TODO:
          // dao.putPrice(conf.station_id, conf.product_id, dateAsNumber, priceAsNumber);
      });
    }).on('error', function(e) {
      // TODO 
    });
  });
};

module.exports = extract;
