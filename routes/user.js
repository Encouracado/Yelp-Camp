const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/user');
const catchAsync = require('../utils/catchAsync');


router.get('/register', (req, res)=>{
	res.render('users/register.ejs');
})

router.post('/register', catchAsync(async (req, res, next) =>{
	try{
	const {username , email, password} = req.body;
	const newUser = new User({username, email});
	const registeredUser = await User.register(newUser, password);
	req.login(registeredUser, (err)=>{
		if(err) return next(err);
		req.flash('success', 'Welcome!!!!')
	    res.redirect('/campgrounds')
	})
	}catch(e){
		req.flash('success', e.message)
		res.redirect('/register');
    }
}))

router.get('/login', (req, res)=>{
	res.render('users/login.ejs')
})

router.post('/login', passport.authenticate('local', {failureFlash:true, failureRedirect:'/login',  }),(req, res)=>{
	req.flash('success', 'WELCOME');
	const redirectUrl = req.session.toReturnTo || '/campgrounds';
	delete req.session.toReturnTo;
	res.redirect(redirectUrl);
})

router.get('/logout', (req, res) =>{
	req.logout();
	req.flash('success', 'You logout your account!!!');
	res.redirect('/campgrounds');
})


module.exports = router;