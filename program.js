var _ = require('lodash');
var http = require('http');
var mongodb = require('mongodb');

// no need to instatiate multiple servers, configuration included
var booksServer = (function() {
    var url = 'http://metadata.helmet-kirjasto.fi/search/author.json?query=Campbell';
    var host = "localhost";
    var port = 80;
    var dbConnectionString = "mongodb://programjs:programjs@localhost:27017/books";
    var cacheMaxAgeMillis = 86400000; // 1 day
    var genericAppError = {error: "Application error. Please contact foo.bar@invalid"};
    var booksDb;

    var fetchBooksFromLibrary = function(onSuccessCallback) {
        http.get(url, function(res) {

            var body = "";
            res.on("data", function(chunk) {
                body += chunk;
            });

            res.on("end", function() {
                var authorRes = JSON.parse(body);
                var books = _.map(authorRes.records, function(record) {
                    return {id: record.library_id, title: record.title, year: record.year}
                });
                onSuccessCallback(books);
            });

        }).on("error", function(e) {
              console.log("Error: ", e);
              onSuccessCallback(genericAppError);
        });
    };

    var getBooks = function(onSuccessCallback) {
        // db connection established
        if (booksDb) {
            var booksCollection = booksDb.collection('books', function(err, collection) {});
            booksCollection.findOne({}, function(err, booksCacheEntry) {
                // if there is cache entry and cache entry is fresh enough then return books from cache entry 
                if (booksCacheEntry && (Date.now() - booksCacheEntry.timestamp < cacheMaxAgeMillis)) {
                    onSuccessCallback(booksCacheEntry.books);
                // fetch books from library, cache to db and return books
                } else if (!err) { 
                    fetchBooksFromLibrary(function(books) {
                        storeBooks(books);
                        // it might make sense to return cache entry while updating books in the background
                        onSuccessCallback(books); 
                    });    
                // log error       
                } else {
                    console.log("Error: ", err);
                    onSuccessCallback(genericAppError);
                }     

            });
        // fetch and return books
        } else {
            fetchBooksFromLibrary(onSuccessCallback);
        }
    };

    var storeBooks = function(books) {
        if (booksDb) {
            var booksCollection = booksDb.collection('books', function(err, collection) {});
            booksCollection.update({}, {$set: {type: 'booksCache', timestamp: Date.now(), books: books}}, {upsert: true}, function(err, r) {});
        }
    };

    var start = function () {
        var mongoClient = mongodb.MongoClient;
        if (dbConnectionString) {
                mongoClient.connect(dbConnectionString, function(err, db) {
                if(!err) {
                    booksDb = db;
                }
            });
        }

        http.createServer(function(req, res) {
            if (req.url === '/api/query/books') {
                getBooks(function(books) {
                    res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
                    res.end(JSON.stringify(books));
                });
            } else {
                res.end();
            }
        }).listen(port, host);
    };

    return {
        start: start
    };
})();

booksServer.start();
