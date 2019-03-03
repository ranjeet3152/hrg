let mongoose = require('mongoose');
var Posts = require('./posts');
autoIncrement = require('mongoose-auto-increment');
connection = mongoose.createConnection("mongodb://localhost:27017/hrg");
autoIncrement.initialize(connection);

let commentsSchema = new mongoose.Schema({
	postId: { type: mongoose.Schema.Types.Number, ref: 'Posts'},
	name: String,
	email: String,
	body: String
});

commentsSchema.plugin(autoIncrement.plugin, 'Comments');

module.exports = mongoose.model('Comments', commentsSchema)