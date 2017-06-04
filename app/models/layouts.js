var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var layouts = new Schema({

  customer: {type: String,required: true},
  layout_type: {type: String,required: true},
  category: {type: String,required: true},
  subcategory: {type: String,required: true},
  expire_date: {type: Date,required:true},
  video_url: {type: String},
  images: {type: Array,default: []},
  layoutID: String,
  incrementID: Number
});

var Lag = mongoose.model('layoutschemas',layouts,'layoutschemas');

layouts.pre('save',function(next){

    var layout = this;
    console.log(layout);
    if (!layout.magazineID) {
        console.log("condition satisfied");
        Lag.findOne().sort('-incrementID').exec(function (err, lastLayout) {


            if (err) {

                return next(err);
            }
            if (lastLayout) {
                layout.incrementID = lastLayout.incrementID + 1;
                layout.layoutID = "L00" + layout.incrementID;

            } else {

                layout.incrementID = 1;
                layout.layoutID = "L00" + layout.incrementID;
            }
            next();
        });
    }
})

module.exports = mongoose.model('LayoutSchema', layouts);
