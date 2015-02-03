var _ = require('lodash');

var http = require('http');
var url = 'http://metadata.helmet-kirjasto.fi/search/author.json?query=Campbell';

function createServer(host, port, htmlBody) {
    var html = "<html><body>" + htmlBody + "</body></html>";
    http.createServer(function (req, res) {
      res.writeHead(200, {'Content-Type': 'text/html'});
      res.end(html);
    }).listen(port, host);
}

http.get(url, function(res) {

    var body = "";
    res.on("data", function(chunk) {
        body += chunk;
    });

    res.on("end", function() {

        var authorRes = JSON.parse(body);

        var books = _.map(authorRes.records, function(record) {
            return {displayName: record.title, year: record.year}
        });

        var content = "";

        _.forEach(_.filter(books, function(book) { return book.year >= 2012}), function(book) {
            content += "<h2>" + book.displayName + "</h2>";
            content += "<p>" + book.year + "</p>";
        });

        createServer('localhost', 80, content);

    });

}).on("error", function(e) {
      console.log("Error: ", e);
});
