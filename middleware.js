module.exports.isLoggedIn = (req, res, next)=>{
	if(!req.isAuthenticated()){
		req.session.toReturnTo = req.originalUrl;
		req.flash('success', 'you need login');
	    return res.redirect('/login')
	}
	next();
}