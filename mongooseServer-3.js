var mongoose = require('mongoose');
var assert = require('assert');

var Dishes = require('./models/dishes-sub-doc');

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
    Dishes.create({
        name:'Combination Pizza',
        description:'Every topping possible on it',
        comments: [
            {
                rating: 3,
                comment: 'This is okay, not super good.',
                author: 'new pizza guy'
            }
        ]
    }, function(err, dish){
        if(err) throw err;

        console.log('Dish create!');
        console.log(dish);
        var id = dish._id;

        // get all the dishes
        setTimeout(function() {  // pause before update
            // find by id and update
            Dishes.findByIdAndUpdate(id, {
                $set: {
                    description: 'Updated topping description'
                }
            }, {
                new: true
            })
            .exec (function(err, dish){ // execute update
                if(err) throw err;
                console.log('Updated dish!');
                console.log(dish);  // print updated record

                dish.comments.push({
                    rating: 5,
                    comment: 'Let\'s get more of this. This update to the pizza was great!',
                    author: 'Brian Kim'
                });

                dish.save(function(err, dishe) {
                    console.log('Added another comment!');
                    console.log(dish);
                    
                    db.collection('dishes').drop(function(){  // drop collection to clean up for testing only
                    db.close();  // close db connection
                    });
                });
            });
        }, 3000);
    });
});