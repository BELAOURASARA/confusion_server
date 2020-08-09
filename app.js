var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var dishRouter = require('./routes/dishRouter');
var promoRouter = require('./routes/promoRouter');
var leaderRouter = require('./routes/leaderRouter');

var uploadRouter = require('./routes/uploadRouter');

var favoriteRouter = require('./routes/favoriteRouter');

var session = require('express-session');
var FileStore = require('session-file-store')(session);

/***************connection with mongodb************************/
const mongoose = require('mongoose');

const Dishes = require('./models/dishes');

var config = require('./config');

//const url = 'mongodb://localhost:27017/conFusion';
const url = config.mongoUrl;
const connect = mongoose.connect(url);

connect.then((db) => {
    console.log("Connected correctly to server");
}, (err) => { console.log(err); });

/***************************************************************/
var passport = require('passport');
var authenticate = require('./authenticate');


/***************************************************************/

var app = express();


// Secure traffic only

app.all('*', (req, res, next) => {
  if (req.secure) { //if the incoming request is already secure so go to the next
    return next();
  }
  else {  //redirect it to the secure url  , 307 represents that the target resource resides temporarily under different URL.
    res.redirect(307, 'https://' + req.hostname + ':' + app.get('secPort') + req.url);
  }
});


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//app.use(cookieParser('12345-67890-09876-54321'));  //this is a secret key to incript info

app.use(session({     //setup session
  name: 'session-id',
  secret: '12345-67890-09876-54321',
  saveUninitialized: false,
  resave: false,
  store: new FileStore()
}));

/************* BASIC AUTHENTICATION **********************************
function auth(req,res,next)
{
    console.log(req.headers);

    var authHeader = req.headers.authorization;
  if (!authHeader) {
      var err = new Error('You are not authenticated!');
      res.setHeader('WWW-Authenticate', 'Basic');
      err.status = 401;
      next(err);
      return;
  }

  var auth = new Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
  var user = auth[0];
  var pass = auth[1];
  if (user == 'admin' && pass == 'password') {
      next(); // authorized
  } else {
      var err = new Error('You are not authenticated!');
      res.setHeader('WWW-Authenticate', 'Basic');      
      err.status = 401;
      next(err);
  }
}

/**********************Updated authentication : Setup cookies  ***********************
function auth (req, res, next) {

  if (!req.signedCookies.user) {  //that means that the user is not authorized yet
    var authHeader = req.headers.authorization;
    if (!authHeader) {
        var err = new Error('You are not authenticated!');
        res.setHeader('WWW-Authenticate', 'Basic');              
        err.status = 401;
        next(err);
        return;
    }
    var auth = new Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
    var user = auth[0];
    var pass = auth[1];
    if (user == 'admin' && pass == 'password') {
        res.cookie('user','admin',{signed: true});  //setup the cookie
        next(); // authorized
    } else {
        var err = new Error('You are not authenticated!');
        res.setHeader('WWW-Authenticate', 'Basic');              
        err.status = 401;
        next(err);
    }
  }
  else {
      if (req.signedCookies.user === 'admin') {
          next();
      }
      else {
          var err = new Error('You are not authenticated!');
          err.status = 401;
          next(err);
      }
  }
}

/*************Update: use of session in place of cookies *************************************

function auth (req, res, next) {
    console.log(req.session);

    if (!req.session.user) {
        var authHeader = req.headers.authorization;
        if (!authHeader) {
            var err = new Error('You are not authenticated!');
            res.setHeader('WWW-Authenticate', 'Basic');                        
            err.status = 401;
            next(err);
            return;
        }
        var auth = new Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
        var user = auth[0];
        var pass = auth[1];
        if (user == 'admin' && pass == 'password') {
            req.session.user = 'admin';
            next(); // authorized
        } else {
            var err = new Error('You are not authenticated!');
            res.setHeader('WWW-Authenticate', 'Basic');
            err.status = 401;
            next(err);
        }
    }
    else {
        if (req.session.user === 'admin') {
            console.log('req.session: ',req.session);
            next();
        }
        else {
            var err = new Error('You are not authenticated!');
            err.status = 401;
            next(err);
        }
    }
}

*********************Update : auth fuction is in routes/users.js/login ***********************/
app.use(passport.initialize());
app.use(passport.session());




app.use('/', indexRouter);
app.use('/users', usersRouter);



/*
function auth (req, res, next) {
    console.log(req.user);

    if (!req.user) {
      var err = new Error('You are not authenticated!');
      err.status = 403;
      next(err);
    }
    else {
          next();
    }
}
app.use(auth);

/*********************************************************************************************/


app.use(express.static(path.join(__dirname, 'public')));




app.use('/dishes',dishRouter);
app.use('/promotions',promoRouter);
app.use('/leaders',leaderRouter);

app.use('/imageUpload',uploadRouter);

app.use('/favorites',favoriteRouter);





// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


module.exports = app;
