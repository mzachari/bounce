var mongoose = require("mongoose");

var scooterSchema = new mongoose.Schema({
  number : { type : String ,required : true,unique : true},
  fuel : { type: Number },
  last_trip_date : { type : Date },
  in_trip : { type : Boolean , default : false},
  next_pin : {type: String}
});

module.exports = mongoose.model("scooter",scooterSchema);
