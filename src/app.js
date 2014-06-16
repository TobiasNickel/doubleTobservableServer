var express = require('express');

var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var app = express();
var http = require('http').Server(app);

var io = require('socket.io')(http);

var tobserver=require("./public/javascripts/tobserver.js");

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//tobserver-SocketServer Begin
tobserver.set("app",{});
var IONameSpace=io.of("/tobserver")
IONameSpace.on('connection', function(socket){
	socket.on('tOmand', function(msg){
		var msgO=JSON.parse(msg);
		try{
            console.log("share: ",msg);
			tobserver.set(msgO.path, msgO.data, msgO.run, true, socket);
		}catch(e){}
	});
});
tobserver.utils.setSocket(IONameSpace);
//tobserver-SocketServer END

// route to load data
app.get('/data.json',function(req,res){
    var data=tobserver.getData(req.query.p);
    res.json({status:data!==undefined?true:false,data:data});
});

var routes = require('./routes/index');
app.use('/', routes(tobserver,io));

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


http.listen(3000, function(){
  console.log('listening on *:3000');
});