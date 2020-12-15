const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/user');
const catchAsync = require('../utils/catchAsync');
const userControllers =  require('../controllers/users')

router.route('/register')
      .get(userControllers.registerForm)
      .post(catchAsync(userControllers.registerUser))

router.route('/login')
      .get(userControllers.loginForm)
      .post(passport.authenticate('local', {  failureFlash: true, failureRedirect: '/login',  }),  userControllers.loginUser)

router.get('/logout', userControllers.logout)

module.exports = router;