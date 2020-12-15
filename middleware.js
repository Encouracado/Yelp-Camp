const { campgroundSchema, reviewSchema } = require('./campgroundSchemas.js');
const ExpressError = require('./utils/expressError');
const Campground = require('./models/campground');
const Review = require('./models/review');

module.exports.isLoggedIn = (req, res, next)=>{
	if(!req.isAuthenticated()){
		req.session.toReturnTo = req.originalUrl;
		req.flash('success', 'you need login');
	    return res.redirect('/login')
	}
	next();
}

module.exports.isAuthor =  async (req, res, next)=>{
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground.author.equals(req.user._id)) {
        req.flash('success', 'You do not have permission to do that!');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
	
}

module.exports.isReviewAuthor =  async (req, res, next)=>{
    const { id , reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review.author.equals(req.user._id)) {
        req.flash('success', 'You do not have permission to do that!');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
	
}

module.exports.validatorReview = (req, res, next)=>{
	const { error } = reviewSchema.validate(req.body);
		if(error){
		//a mensagem do erro e um array de objetos por isso voce usa map para exibir o erro em uma unica string
		const msg = error.details.map(el=> el.message).join('.')
		throw new expressError(msg, 404)
	}else{
		next();
	}
}

module.exports.validatorBody = function(req, res, next){		
	//aqui ocorre a validacao
	const { error } = campgroundSchema.validate(req.body);
	if(error){
		//a mensagem do erro e um array de objetos por isso voce usa map para exibir o erro em uma unica string
		const msg = error.details.map(el=> el.message).join('.')
		throw new expressError(msg, 404)
	}else{
		next();
	}
};
