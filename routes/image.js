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

function sortonConfindence(x,y){
  return y.Confidence-x.Confidence;
}
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
      data=data['TextDetections'];
      if(data.length==0){
        var objResp={status:false};
        res.send(objResp);
      }else{
        var primaryDetections = data.filter(function(el){
          return el.ParentId == undefined;
        });

        var primaryDetections = primaryDetections.filter(function(el){
          return el.DetectedText!= 'BOUNCE';
        })

        primaryDetections.sort(sortonConfindence);

        if(primaryDetections.length==1){
          var numberPlate = primaryDetections[0].DetectedText.replace(/[^a-z0-9]/gi,'');
          var objResp = {"number":numberPlate,status:true}
          res.send(objResp);
        }
        else if(primaryDetections[0].DetectedText.replace(/[^a-z0-9]/gi,'').length<9){
          var height1 = primaryDetections[0].Geometry.Polygon[0].Y;
          var height2 = primaryDetections[1].Geometry.Polygon[0].Y;
          var recog1=primaryDetections[0].DetectedText.replace(/[^a-z0-9]/gi,'');
          var recog2=primaryDetections[1].DetectedText.replace(/[^a-z0-9]/gi,'');
          var numberPlate="";
          // if(recog1=="BOUNCE"){
          //   recog1="";
          // }
          // if(recog2=="BOUNCE"){
          //   recog2=="";
          // }
          if(height1<height2){
            numberPlate=recog1+recog2;
          }
          else{
            numberPlate=recog2+recog1;
          }
          //var numberPlate= primaryDetections[0].DetectedText.replace(/[^a-z0-9]/gi,'')+primaryDetections[1].DetectedText.replace(/[^a-z0-9]/gi,'');
          var objResp = {"number":numberPlate,status:true}
          res.send(objResp);
        }
        else{
          var numberPlate = primaryDetections[0].DetectedText.replace(/[^a-z0-9]/gi,'');
          var objResp = {"number":numberPlate,status:true}
          res.send(objResp);
        }
      }
    }
  });
});

// function extractNumberPlate(data){
//   if(data.length==0){
//     return "";
//   }
//   if(data.length==1){
//     return data[0].DetectedText;
//   }
//   if(data.length==2){
//     if(data[0].DetectedText[0]=='K'){
//       if(data[0].DetectedText.replace(/[^a-z0-9]/gi,'').length<9){
//         return data[0].DetectedText.replace(/[^a-z0-9]/gi,'')+data[1].DetectedText.replace(/[^a-z0-9]/gi,'');
//       }
//       else{
//         return data[0].DetectedText.replace(/[^a-z0-9]/gi,'')
//       }
//     }
//     return data[1].DetectedText.replace(/[^a-z0-9]/gi,'')
//   }
//
//   else{
//     for(var i=1;i<data.length;i++){
//       if(data[i].DetectedText[0]=='K'){
//         return
//       }
//     }
//   }
// }


module.exports = router;
