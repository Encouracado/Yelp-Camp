const User = require('../models/user');
const passport = require('passport');

module.exports.registerForm = (req, res)=>{
	res.render('users/register.ejs');
};

module.exports.registerUser = async (req, res, next) =>{
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
};

module.exports.loginForm = (req, res)=>{
	res.render('users/login.ejs')
};

module.exports.loginUser = (req, res)=>{
	req.flash('success', 'WELCOME');
	const redirectUrl = req.session.toReturnTo || '/campgrounds' ;
	res.redirect(redirectUrl);
	delete req.session.toReturnTo;
	
};

module.exports.logout = (req, res) =>{
	req.logout();
	req.flash('success', 'You logout your account!!!');
	res.redirect('/campgrounds');
};

