/**
 * Created by asantha on 3/22/2017.
 */
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var customers = new Schema({

    first_name: {type: String, require: true},
    last_name: {type: String, require: true},
    email: {type: String,require: true,index:{unique: true}},
    mobile: {type: String, require: true},
    address: {type: String,require: true},
    facebookUrl: String,
    twitterUrl: String,
    plusUrl: String,
    profile_picture: String,
    cover_photo: String,
    description: String,
    layout: String,
    incrementID: Number,
    customerID: String
});

var Cust = mongoose.model('customerschemas', customers,'customerschemas');

customers.pre('save',function(next){

    var customer = this;
    console.log(customer);
    if (!customer.customerID) {
        console.log("condition satisfied");
        Cust.findOne().sort('-incrementID').exec(function (err, lastCustomer) {

            if (err) {

                return next(err);
            }
            if (lastCustomer) {
                customer.incrementID = lastCustomer.incrementID + 1;
                customer.customerID = "C00" + customer.incrementID;

            } else {

                customer.incrementID = 1;
                customer.customerID = "C00" + customer.incrementID;
            }
            next();
        });
    }
})

module.exports = mongoose.model('CustomerSchema', customers);
