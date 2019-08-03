var express = require('express');
var image = require('../models/image');
var multer = require('multer');
var mongoose = require('mongoose');
var fs = require('fs');
var aws = require('aws-sdk');
var multerS3 = require('multer-s3');
var router = express.Router();

aws.config.update({
    accessKeyId: "AKIAITJKFMBMDBXM4FHQ",
    secretAccessKey: "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",
    "region": "ap-south-1"
  });

var s3 = new aws.S3();
var rekognition = new aws.Rekognition();


var upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'bouncehack',
    acl:'public-read',
    metadata: function (req, file, cb) {
      cb(null, {fieldName: file.fieldname});
    },
    key: function (req, file, cb) {
      cb(null, ""+Date.now()+"_"+file.originalname)
    }
  })
});



// Create a new Image
router.post('/',upload.single('avatar'),function(req,res,next){

  // console.log()
  var params = {
    Image: {
      S3Object: {
        Bucket: req.file.bucket,
        Name: req.file.key
      }
    }
  };
  rekognition.detectText(params, function(err, data) {
    if (err){
      console.log(err, err.stack); // an error occurred
      res.status(500).json({error: err});
    }
    else{
      // have to process the response to extract the number plate from this section
      res.send(data);
    }
  });
});

// router.get('/:id',function(req,res,next){
//   // Get a Specific Image alone from the Server
//   const id = req.params.id;
//   image.findById(id)
//     .select('imageName _id')
//     .exec()
//     .then(doc =>{
//       if(doc){
//         res.send(doc)
//       }else{
//         res.status(404).json({message : "No Valid Entry found for the provided ID"});
//       }
//     })
//     .catch(err =>{
//       console.log(err);
//       res.status(500).json({error: err});
//     })
// });

// router.get('/',function(req,res,next){
//   image.find({},function(err,allImages){
//     if(err){
//       return next(err);
//     }
//     res.json(allImages);
//   });
// });
//
//
// 
//
// //Delete an Existing Image
// router.delete('/:id',function(req,res,next){
//   image.findOneAndDelete({_id : req.params.id},function(err,result){
//     if(err) return next(err);
//     fs.unlink(result.imageName,(err)=>{
//       if(err) return next(err);
//       res.send("Deleted the Image Successfully");
//     })
//   })
//   // Delete The Same Image from the Server as well
// })



module.exports = router;
