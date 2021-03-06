var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var config = require('./config');
var mongoose = require('mongoose');
var fs = require('fs');

var app = express();

var http = require('http').Server(app);
var io = require('socket.io')(http);
var multer = require('multer');


mongoose.connect(config.database,function(err){
	
	if(err){
		
		console.log(err);
	}else{
		console.log("Connected to Database");
	}
})

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(morgan('dev'))

var storage = multer.diskStorage({

    destination:function (req, file, cb) {

        cb(null, './public/app/uploads/');
    },
    filename: function (req, file, cb) {

        var datetimestamp = Date.now();
        cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1]);
    }
});

var upload = multer({
    storage: storage
}).any();

app.use(function(req, res, next){

    res.header("Access-Control-Allow-Methods", "POST, PUT, OPTIONS, DELETE, GET");
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept,username,password,x-access-token");
    if ('OPTIONS' === req.method) {
        //respond with 200
        res.send(200);
    }
    else {
        //move on
        next();
    }
})

//render all css and js files to html views
app.use(express.static(__dirname+'/public'))

var api = require('./app/routes/api')(app, express, io, upload, fs);
var mobile_api = require('./app/routes/mobile_api')(app, express, io, upload, fs);
app.use('/api', api);
app.use('/mobile_api',mobile_api);


app.get('*',function(req, res){
	
	res.sendFile(__dirname+'/public/app/views/index.html');
})

http.listen(config.port, function(err){
	
	
	if(err){
		
		console.log(err);
	}else{
		console.log("listening to port 3000");
	}
})