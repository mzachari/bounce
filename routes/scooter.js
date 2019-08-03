var express = require('express');
var scooter = require('../models/scooter');
var router = express.Router();
var multer = require('multer');

router.post('/',function(req,res,next){
  var scooterDate = req.body;
  scooterDate['next_pin'] = Math.random().toString().slice(2,6);
  scooterDate['last_trip_date']=Date();
  var newScooter = new scooter(scooterDate);
  //console.log(newScooter);
  newScooter.save(function(err,doc){
    if(err){
      return next(err);
    }
    console.log("New Scooter Info Added");
    res.send(doc);
  });
});

router.get('/',function(req,res,next){
  scooter.find({},function(err,allScooters){
    if(err){
      return next(err);
    }
    res.json(allScooters);
  });
});

router.get('/:number',function(req,res,next){
  scooter.find({number : req.params.number},function(err,scooter){
    if(err){
      return next(err);
    }
    res.json(scooter[0]);
  });
});

router.put('/:number',function(req,res,next){
  var updateData = req.body;
  updateData['next_pin'] = Math.random().toString().slice(2,6);
  updateData['last_trip_date']=Date();
  scooter.findOneAndUpdate({number : req.params.number},{$set: updateData},{new: true},function(err,doc){
    if(err) return next(err);
    res.send(doc);
  });
});

router.delete('/:id',function(req,res,next){
  scooter.findOneAndDelete({_id : req.params.id},function(err){
    if(err) return next(err);
    res.send("Scooter Info Deleted Successfully");
  })
});

module.exports = router;
