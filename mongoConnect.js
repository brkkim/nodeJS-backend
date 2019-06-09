// mongo db connection support
var MongoClient = require('mongodb').MongoClient;
// import mongodb opersion module
var dboper = require('./mongoOps');

// assert module to check for errors
var assert = require('assert');

// Connect to MongoDB URL
var url = 'mongodb://localhost:32768';

// Use connect method to connect to the server
MongoClient.connect(url, function (err, client){  // open mongodb connection 
    assert.equal(err, null);  // check for mongodb connection error
    console.log("Connected to mongodb server @ " + url);

    // connect to specific database instance in mongodb
    var db = client.db("conFusion");
    // use specific collection for documents
    dboper.insertDocument(db, {name:"Vadonut", description: "Test"},
        "dishes", function(result) {
            console.log(result.ops);
            dboper.findDocuments(db, "dishes", function(docs){
                console.log(docs);
                dboper.updateDocument(db, {name:"Vadonut"}, { description: "Updated Test"},
                "dishes", function(result) {
                    console.log(result.result);

                    // print update result
                    dboper.findDocuments(db, "dishes", function(docs){
                        console.log(docs);
                        db.dropCollection("dishes", function(result) {
                            console.log(result);
                            client.close();
                        });
                    });
                    
                });
            });
        }
    )
});