let mongoose = require('mongoose');
var Posts = require('./posts');
autoIncrement = require('mongoose-auto-increment');
connection = mongoose.createConnection("mongodb://localhost:27017/hrg");
autoIncrement.initialize(connection);

let userSchema = new mongoose.Schema({
	name: String,
	username: String,
	email: String,
	phone: String,
	website: String,
	address: {
		street: String,
		suite: String,
		city: String,
		zipcode: String,
		geo: {
			lat: Number,
			lng: Number
		}
	},
	company: {
		name: String,
		catchPhrase: String,
		bs: String
	},
});

userSchema.plugin(autoIncrement.plugin, 'User');

module.exports = mongoose.model('User', userSchema)