var dao = require('./dao.js');
var _ = require('lodash');
var async = require('async');

var service = {
  getBestStationPrice:function(from, callback) {
    async.waterfall([
        function(cb) {
          dao.getPrices(from, cb); 
        },
        function(rows, cb) {
          var res = _.max(
            _.reduce(
              _.groupBy(rows, 'station_id'), 
              function(result, value, key) {
                result[key] = _.max(value, function(pe) {
                      var d = new Date(pe.price_date);
                      return d;
                });
                return result;
              }, 
              {}
            ), 
            function(station) {
              return -station.price;
            }
          );
          cb(null, res);
        }
      ], 
      function(err, rows) {
	      callback(err, rows);
      }
    );
  },
  getAvgStationPrices:function(from, callback) {
    async.waterfall([
        function(cb) {
          dao.getPrices(from, cb); 
        }
      ], 
      function(err, rows) {
        var res = _.reduce(
                    _.groupBy(rows, 'price_date'), 
                    function(result, values, key) {
                      result[key] = _.reduce(
                                        values, 
                                        function(sum, val) { 
                                          return sum + val.price
                                        }, 
                                        0
                                    ) / values.length;
                      return result;
                    }, 
                    {}
                  );
        callback(err, res);
      }
    );
  }
};

module.exports = service;
