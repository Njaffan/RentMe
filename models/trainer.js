var mongoose = require('mongoose');


// User Schema
var TrainerSchema = mongoose.Schema({
	name: {
		type: String,
		index:true
	},
	service: {
		type: String
	},
	price: {
		type: Number
    },
    icon: 
        { data: Buffer, contentType: String }
    
	
});

var Trainer = module.exports = mongoose.model('Trainer', TrainerSchema);

module.exports.createUser = function(newTrainer, callback){
	
    newTrainer.save(callback);
	  
}

module.exports.getUserByUsername = function(username, callback){
	var query = {username: username};
	Trainer.findOne(query, callback);
}

module.exports.getUserById = function(id, callback){
	Trainer.findById(id, callback);
}

