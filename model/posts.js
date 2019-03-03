let mongoose = require('mongoose');
var Users = require('./user');
var Comments = require('./comments');
autoIncrement = require('mongoose-auto-increment');
connection = mongoose.createConnection("mongodb://localhost:27017/hrg");
autoIncrement.initialize(connection);

let postsSchema = new mongoose.Schema({
	comments: [{ type: mongoose.Schema.Types.Number, ref: 'Comments' }],
	userId: { type: mongoose.Schema.Types.Number, ref: 'Users' },
	title: String,
	body: String
});

postsSchema.plugin(autoIncrement.plugin, 'Posts');

module.exports = mongoose.model('Posts', postsSchema)