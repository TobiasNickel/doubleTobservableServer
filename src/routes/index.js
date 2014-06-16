module.exports=function(tobserver,io){
	
	var express = require('express');
	var router = express.Router();
	/* GET home page. */
	router.get('/', function(req, res) {
		res.render('index', { title: 'double Tobservable' });
	});

	return router;
};
