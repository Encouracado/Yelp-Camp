const Reviews = require('../models/review');
const Campground = require('../models/campground');

module.exports.createReview = async (req, res)=>{
	const campground = await Campground.findById(req.params.id);
	const review = new Reviews(req.body.review);
	review.author = req.user._id;
	campground.reviews.push(review);
	await review.save();
	await campground.save();
	req.flash('success', 'Review created with exit!!!')
	res.redirect(`/campgrounds/${campground._id}`)
	
};

module.exports.deleteReview =  async (req, res) =>{
	const {id, reviewId} = req.params;
	//remove do array de comentarios do acampamento o comentario
	const pull = await Campground.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
	// apaga o comentario da collection reviews
	const deletado = await Reviews.findByIdAndDelete(reviewId);
	res.redirect(`/campgrounds/${id}`);
};
