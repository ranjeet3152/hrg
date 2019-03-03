var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/hrg";
var mongoose = require('mongoose');

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  console.log("Database created!");
  db.close();
});