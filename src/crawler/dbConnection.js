/**
 * Created by berlin on 2017/3/15.
 * Crawler Constructor
 */

const MongoClient = require('mongodb').MongoClient;
const config = require('../utils/config');

let db;

// Use connect method to connect to the server
MongoClient.connect(config.DB_SERVER, function (err, database) {
    if (!err) {
        console.log("Connected successfully to server");
        db = database;
    }
});


//test method

//Insert a Document
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
//Find All Documents
const findAllDocuments = function (db, callback) {
    // Get the documents collection
    let collection = db.collection('documents');
    // Find some documents
    collection.find({}).toArray(function (err, docs) {
        console.log("Found the following records");
        console.log(docs);
        callback(docs);
    });
};
//Find Documents with a Query Filter
const findDocuments = function (db, callback) {
    // Get the documents collection
    let collection = db.collection('documents');
    // Find some documents
    collection.find({'a': 3}).toArray(function (err, docs) {
        assert.equal(err, null);
        console.log("Found the following records");
        console.log(docs);
        callback(docs);
    });
};
//Update a document
const updateDocument = function (db, callback) {
    // Get the documents collection
    let collection = db.collection('documents');
    // Update document where a is 2, set b equal to 1
    collection.updateOne({a: 2}
        , {$set: {b: 1}}, function (err, result) {
            assert.equal(err, null);
            assert.equal(1, result.result.n);
            console.log("Updated the document with the field a equal to 2");
            callback(result);
        });
};
//Remove a document
const removeDocument = function (db, callback) {
    // Get the documents collection
    let collection = db.collection('documents');
    // Delete document where a is 3
    collection.deleteOne({a: 3}, function (err, result) {
        assert.equal(err, null);
        assert.equal(1, result.result.n);
        console.log("Removed the document with the field a equal to 3");
        callback(result);
    });
};

module.exports = db;
