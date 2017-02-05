var express = require('express');
var router = express.Router();
var User = require('../model/user');

router.get('/', function(req, res) {
  res.render('index');
});

router.get('/login', function(req, res) {
  res.render('login');
});

router.post('/login', passport.authenticate('local', { failureRedirect: '/login' }), function(req, res) {
  res.redirect('/');
});

router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

router.get('/profile', passport.authenticate('local', { failureRedirect: '/login' }), function(req, res) {
  res.render('profile', { user: req.user });
});

router.post('/updateprofile', passport.authenticate('local', { failureRedirect: '/login' }), function(req, res) {
  User.find({ email: req.user.email }, function(err, user) {
    user.name = req.body.name;
    user.save(function(err) {
      if(err)
        console.error(err);
    });
  });
});

module.exports = router;
