var mongoose = require('mongoose');
var assert = require('assert');

var Dishes = require('./models/dishes');

//open connection to mongodb
var url = 'mongodb://localhost:32768/conFusion';
mongoose.connect(url);
var db = mongoose.connection;

// on connection error, handle by messaging to console
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// successful connection open the connection
db.once('open', function() {
    // connected, print message to console
    console.log("MongoDB connected at : " + url);

    // create a new dish
    var newDish = Dishes({
        name: "Hawaiian Pizza",
        description: "Ham and pineapple pizza"
    });

    // explicit save to commit data into mongodb
    newDish.save(function(err) {
        if (err) throw err;
        console.log('Dish created!');

        // get all dishes
        Dishes.find({}, function(err, dishes) {
            if (err) throw err;

            // object of all the dishes
            console.log(dishes);

            db.collection('dishes').drop(function(err){
                db.close();
            });
        });
    });
});