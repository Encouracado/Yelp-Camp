const express = require('express');
const router = express.Router({mergeParams: true});
const catchAsync = require('../utils/catchAsync')
const expressError = require('../utils/expressError')
const Reviews = require('../models/review')
const Campground = require('../models/campground')
const {campgroundSchema, reviewSchema} = require('../campgroundSchemas')
const {validatorReview, isLoggedIn, isReviewAuthor} =  require('../middleware')
const reviewControllers = require('../controllers/review');


router.post('/', isLoggedIn, validatorReview, catchAsync(reviewControllers.createReview))

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviewControllers.deleteReview))

module.exports = router;