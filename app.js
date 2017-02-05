var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressSession = require('express-session');
var passport = require('passport'); 
var LocalStratergy = require('passport-local');
var User = require('./model/user');

var index = require('./routes/index');
var users = require('./routes/users');

passport.use(new LocalStratergy( {
    usernameField: 'email',
    passwordField: 'password'
  }, function(username, password, done) {
    User.find({ email: username }, function(err, user) {
      if(err) {
        return done(err);
      }
      if(!user) {
        return done(null, false, { message: "That account does not exist. Would you like to sign up instead?" });
      }
      user.validatePassword(password, function(res) {
        if(res == true)
          return done(null, false, { message: 'Incorrect password' });
        return done(null, user);
      });
    });
  }
));

passport.serializeUser(function(user, callback) {
  callback(null, user.id);
});

passport.deserializeUser(function(id, callback) {
  User.findById(id, function(err, user) {
    if(err)
      callback(err);
    callback(null, user);
  });
});

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(expressSession({ secret: 'codespace2017', resave: false, saveUninitialized: false}));
app.use(passport.initialize());
app.use(passport.session());

app.use('/', index);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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
