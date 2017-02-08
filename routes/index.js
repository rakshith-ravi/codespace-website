var express = require('express');
var router = express.Router();
var passport = require('passport');
var bcrypt = require('bcrypt');
var User = require('../model/user');
var Team = require('../model/team');

const saltRounds = 10;

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

router.get('/signup', function(req, res) {
  res.render('/signup');
})

router.post('/signup', function(req, res) {
  bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
    User.find({ email: req.body.email }, function(err, user) {
      if(err) {
        res.json({
          success: false,
          message: 'Error while creating user'
        });
        console.error(err);
      }
      if(user.length == 0) {
        var newUser = User({
          email: req.body.email,
          password: hash,
          name: req.body.name
        });
        newUser.save(function(err) {
          if(err)
            res.json({
              success: false,
              message: 'Error while creating user'
            });
          else
            res.json({
              success: true,
              message: 'Successfully created account'
            })
        });
      } else {
        res.json({
          success: false,
          message: 'That user account already exists'
        });
      }
    });
  });
});

router.post('/getteams', passport.authenticate('local', { failureRedirect: '/login' }), function(req, res) {
  Team.find({}, function(err, teams) {
    if(err) {
      res.json({
        success: false,
        message: 'Error finding teams'
      });
    }
    res.json({
      success: true,
      teams: teams
    });
  });
});

router.post('/findteams', passport.authenticate('local', { failureRedirect: '/login' }), function(req, res) {
  Team.find({name: { '$regex': req.body.name }}, function(err, teams){
    if(err) {
      res.json({
        success: false,
        message: 'Error finding teams'
      });
      console.error(err);
    }
    res.json({
      success: true,
      teams: teams
    });
  })
});

router.post('/jointeam', passport.authenticate('local', { failureRedirect: '/login' }), function(req, res) {
  Team.find({ name: req.body.name }, function(err, teams) {
    if(err) {
      res.json({
        success: false,
        message: 'Error while finding team'
      });
      console.error(err);
    }
    if(teams.length == 0) {
      res.json({
        success: false,
        message: 'That team does not exist'
      });
    }
    bcrypt.compare(req.body.password, teams[0].password, function(err, res) {
      if(res == true) {
        req.user.teamId = teams[0]._id;
        req.user.save(function(err) {
          if(err)
            console.error(err);
          res.json({
            success: true,
            message: 'Successfully joined team'
          });
        });
      } else {
        res.json({
          success: false,
          message: 'Invalid password'
        });
      }
    });
  });
});

router.post('/submitidea', passport.authenticate('local', { failureRedirect: '/login' }), function(req, res) {
  Team.findById(req.user.teamId, function(err, team) {
    team.idea = req.body.idea;
    team.save(function(err) {
      if(err) {
        console.error(err);
        res.json({
          success: false,
          message: 'Error saving team details'
        });
      }
      res.json({
        success: true,
        message: 'Successfully submitted your idea'
      });
    });
  });
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
