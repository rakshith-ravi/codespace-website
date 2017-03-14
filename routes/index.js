var express = require('express');
var router = express.Router();
var passport = require('passport');
var bcrypt = require('bcrypt');
var User = require('../model/user');

var redirectURL = "https://academics.vit.ac.in/online_application2/onlinepayment/Online_pay_request1.asp";

router.post('/submit', function(req, res) {
  var newUser;
  if(req.body.Checkbox_pay) {
    newUser = User({
      name: req.body.name_pay,
      email: req.body.email_pay,
      vitian: req.body.Checkbox_pay,
      regno: req.body.reg_no_pay
    });
  } else {
    newUser = User({
      name: req.body.name_pay,
      email: req.body.email_pay,
      vitian: req.body.Checkbox_pay,
      university: req.body.uni_name_pay
    });
  }
  newUser.save(function(err) {
    if(!err) {
      res.redirect(redirectURL);
    }
  });
});

module.exports = router;
