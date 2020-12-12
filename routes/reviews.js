const express = require('express');
const router = express.Router({mergeParams: true});
const catchAsync = require('../utils/catchAsync')
const expressError = require('../utils/expressError')
const Reviews = require('../models/review')
const Campground = require('../models/campground')
const {campgroundSchema, reviewSchema} = require('../campgroundSchemas')

const validatorReview = (req, res, next)=>{
	const { error } = reviewSchema.validate(req.body);
		if(error){
		//a mensagem do erro e um array de objetos por isso voce usa map para exibir o erro em uma unica string
		const msg = error.details.map(el=> el.message).join('.')
		throw new expressError(msg, 404)
	}else{
		next();
	}
}

router.post('/', validatorReview, catchAsync( async (req, res)=>{
	const campground = await Campground.findById(req.params.id);
	const review = new Reviews(req.body.review);
	campground.reviews.push(review);
	await review.save();
	await campground.save();
	req.flash('success', 'Review created with exit!!!')
	res.redirect(`/campgrounds/${campground._id}`)
	
}))

router.delete('/:reviewId', catchAsync( async (req, res) =>{
	const {id, reviewId} = req.params;
	//remove do array de comentarios do acampamento o comentario
	const pull = await Campground.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
	// apaga o comentario da collection reviews
	const deletado = await Reviews.findByIdAndDelete(reviewId);
	res.redirect(`/campgrounds/${id}`);
}))

module.exports = router;