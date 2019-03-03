var express = require("express");
var mongo = require("mongodb");
var https = require("https");
var User = require('./model/user');
var MongoClient = require('mongodb').MongoClient;
var Post = require('./model/posts');
var Comment = require('./model/comments');
const app = express();
const port = 3000;
const axios = require('axios');
var mongoose = require('mongoose');
mongoose.connect("mongodb://localhost:27017/hrg");
const bodyParser = require('body-parser');


app.use('/populate', function(req, res, next) {
	axios.get('https://jsonplaceholder.typicode.com/users').then(response => {
    var data = response.data;
    //console.log(JSON.stringify(data[0].name));
    for(var i=0; i < data.length; i++) {
    	var user = new User({
    		_id: data[i].id,
	    	name: data[i].name,
				username: data[i].username,
				email: data[i].email,
				phone: data[i].phone,
				website: data[i].website,
				address: {
					street: data[i].address.street,
					suite: data[i].address.suite,
					city: data[i].address.city,
					zipcode: data[i].address.zipcode,
					geo: {
						lat: data[i].address.geo.lat,
						lng: data[i].address.geo.lng
					}
				},
				company: {
					name: data[i].company.name,
					catchPhrase: data[i].company.catchPhrase,
					bs: data[i].company.bs
				}
    	});
    	//console.log(JSON.stringify(user));
    	user.save().then(doc => {
     		//console.log(doc);
   		}).catch(err => {
     		console.error(err);
   		})
    }
  })
  .catch(error => {
    console.log(error);
  });
  next();

});
	

app.use('/populate', function(req, res, next) {
	axios.get('https://jsonplaceholder.typicode.com/posts').then(response => {
		var data = response.data;
		//console.log(JSON.stringify(data));
		data.forEach(function(single_post) {
			var post = new Post({
				_id: single_post.id,
				userId: single_post.userId,
				title: single_post.title,
				body: single_post.body
			});
			post.save().then(doc => {
			}).catch(err => {
				console.error(err);
			});
		}); 
		next();
	});
});

app.use('/populate', function(req, res, next) {
	axios.get('https://jsonplaceholder.typicode.com/comments').then(response => {
		var data = response.data;
		//console.log(JSON.stringify(data));
		data.forEach(function(single_comment) {
			var comment = new Comment({
				_id: single_comment.id,
				postId: single_comment.postId,
				name: single_comment.name,
				body: single_comment.body,
				email: single_comment.email
			});
			comment.save().then(doc => {
				//console.log(doc);
				Post.findById(single_comment.postId).then(post => {
					if(post) {
						post.comments.push(doc);
						post.save().catch(err => {
							console.error(err);
						});
					}
				}).catch(err => {
					console.error(err);
				});
			}).catch(err => {
				console.error(err);
			});
		}); 
		next();
	});
});


app.get('/populate', (req, res) => {
	res.send("Data populated")
});

app.get('/users', (req, res) => {
	User.find({}).then(doc => {
    res.send(JSON.stringify(doc));
  }).catch(err => {
    console.error(err)
  });
});

app.get('/users/:user_id', (req, res) => {
	var user_id = req.params.user_id;
	User.find({_id: user_id}).then(doc => {
		res.send(JSON.stringify(doc));
	}).catch(err => {
		console.error(err)
	});
});

app.get('/posts/:user_id', (req, res) => {
	var user_id = req.params.user_id;
	Post.find({userId: user_id}).populate('comments').exec().then(doc => {
		//console.log(doc);
    res.send(JSON.stringify(doc));
  }).catch(err => {
    console.error(err)
  });
});

app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 


app.post('/update/user/:user_id', (req, res) => {
	User.findOneAndUpdate(req.params.user_id, {
		address: {
			street: req.body.address.street,
			suite: req.body.address.suite,
			city: req.body.address.city,
			zipcode: req.body.address.zipcode,
			geo: {
				lat: req.body.address.geo.lat,
				lng: req.body.address.geo.lng
			},
		},
		phone: req.body.phone,
		website: req.body.website,
		company: {
			name: req.body.company.name,
			catchPhrase: req.body.company.catchPhrase,
			bs: req.body.company.bs
		}
	}, function(err, res) {
		if (err) {
			res.send(err);
		} else {
			console.log(res);
			console.log('user updated');
			res.send('successfully updated')
		}
	});
});

app.listen(port, () => console.log('Server Started'));