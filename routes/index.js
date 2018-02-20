var express = require('express');
var router = express.Router();
var TrainerSchema = require('../models/trainer');


// Get Homepage
router.get('/', ensureAuthenticated, function(req, res){
	
	TrainerSchema.find({}, function(err, data) {
		var dbservices = {
			services: data,
			islogin:req.isAuthenticated()
		}
		console.log(data)
		res.render('index',dbservices);
	  });
	
});

function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return next();
	} else {
		//req.flash('error_msg','You are not logged in');
		res.redirect('/users/login');
	}
}

module.exports = router;