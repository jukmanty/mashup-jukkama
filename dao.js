var config    = require('./config.json');
var mysql     = require('mysql');
var pool      = mysql.createPool({
  host     :  config.db.host,
  user     :  config.db.user,
  password :  config.db.password,
  database :  config.db.database,
  connectionLimit : config.db.maxConnections,
  insecureAuth : true,
  debug    :  false
});

var db = {
  query: function(sql, params, callback) {
    pool.getConnection(function(err,connection){
      if (err) {
        connection.release();
        callback({"error": 100, "detail": err}, null);
        return;
      }

      connection.query(sql, params, function(err,rows){
        connection.release();
        callback(err, rows);
      });

      connection.on('error', function(err) {
        callback({"error" : 101, "detail": err}, null);
      });
    });
  }
};

var dao = {
  getPrices: function(from, callback) {
    db.query("select sp.station_id, s.name as station_name, sp.product_id, p.name as product_name, sp.price_date, sp.price from cg_station s, cg_product p, cg_station_price sp where sp.station_id = s.id and sp.product_id = p.id and sp.price_date >= ? order by sp.price_date", [from], callback);
  },
  putPrice: function(station_id, product_id, price_date, price) {
    db.query("insert into station_price (station_id, product_id, price_date, price) VALUES (?, ?, ?, ?)", [station_id, product_id, price_date, price], callback);
  }
};

module.exports = dao;

