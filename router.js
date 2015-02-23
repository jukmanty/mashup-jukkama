var async = require('async');

module.exports = function(app, service) {

  var outputJson = function(res, jsonDataCallback, paramArray) {
    async.waterfall([
      function(callback){
        var params = [];
        params.push(paramArray);
        params.push(callback);
        jsonDataCallback.apply(this, params);
      }],
      function(err, result) {
        res.json(result);
      }
    );
	
  };

  var weekAgo = function() {
  	var d = new Date();
  	return d.getTime() - 1000*60*60*24*7
  };

  app.get('/api/best', function(req, res) {
    outputJson(res, service.getBestStationPrice, weekAgo());
  });

  app.get('/api/avg', function(req, res) {
    outputJson(res, service.getAvgStationPrices, weekAgo());
  });

};
