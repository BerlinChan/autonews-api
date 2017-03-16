/**
 * Created by berlin on 2017/3/15.
 * Crawler Constructor
 */

const MongoClient = require('mongodb').MongoClient;

// Connection URL
const url = 'mongodb://localhost:27017/auto-news';

// Use connect method to connect to the server
MongoClient.connect(url, function (err, db) {
    console.log("Connected successfully to server");

    findDocuments(db, function() {
        db.close();
    });
});

//test
const insertDocuments = function (db, callback) {
    // Get the documents collection
    let collection = db.collection('documents');
    // Insert some documents
    collection.insertMany([
        {a: 1}, {a: 2}, {a: 3}
    ], function (err, result) {
        console.log("Inserted 3 documents into the collection");
        callback(result);
    });
};
const findDocuments = function (db, callback) {
    // Get the documents collection
    let collection = db.collection('documents');
    // Find some documents
    collection.find({}).toArray(function (err, docs) {
        console.log("Found the following records");
        console.log(docs);
        callback(docs);
    });
};

//module.exports = admin.database();
