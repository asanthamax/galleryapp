/**
 * Created by asantha on 3/23/2017.
 */
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var magazines = new Schema({

    title: {type: String,required: true},
    cover_image: {type: String, required: true},
    document: {type: String,required: true},
    status:{type: String,required: true},
    magazineID: String,
    incrementID: Number
});

var Mag = mongoose.model('magazineschemas',magazines,'magazineschemas');

magazines.pre('save',function(next){

    var magazine = this;
    console.log(magazine);
    if (!magazine.magazineID) {
        console.log("condition satisfied");
        Mag.findOne().sort('-incrementID').exec(function (err, lastMagazine) {


            if (err) {

                return next(err);
            }
            if (lastMagazine) {
                magazine.incrementID = lastMagazine.incrementID + 1;
                magazine.magazineID = "M00" + magazine.incrementID;

            } else {

                magazine.incrementID = 1;
                magazine.magazineID = "M00" + magazine.incrementID;
            }
            next();
        });
    }
})

module.exports = mongoose.model('MagazineSchema', magazines);


