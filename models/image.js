var mongoose = require("mongoose");

var imageSchema =new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  imageName : {type : String , required : true},
});

module.exports = mongoose.model("image",imageSchema);
