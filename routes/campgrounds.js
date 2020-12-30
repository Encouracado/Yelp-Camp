const express = require('express');
const router = express.Router({mergeParams: true});
const catchAsync = require('../utils/catchAsync')
const expressError = require('../utils/expressError')
const Campground = require('../models/campground')
const Reviews = require('../models/review')
const {campgroundSchema, reviewSchema} = require('../campgroundSchemas')
const {isLoggedIn, isAuthor, validatorBody} = require('../middleware')
const campgroundsControllers = require('../controllers/campgrounds');
const {storage} = require('../cloudinary')
const multer = require('multer')
const upload = multer({storage})

router.route('/')
      .get(campgroundsControllers.renderIndex)
      .post(isLoggedIn, upload.array('image'), validatorBody, catchAsync(campgroundsControllers.postNewCampground));

router.get('/new', isLoggedIn, campgroundsControllers.renderFormNewCampground);

router.route('/:id')
      .get(catchAsync(campgroundsControllers.showOneCampground))
      .put(isAuthor, isLoggedIn, upload.array('image'), validatorBody, catchAsync(campgroundsControllers.putEditCampground))
      .delete(isAuthor, isLoggedIn, catchAsync(campgroundsControllers.deleteCampground));

router.get('/:id/edit', isAuthor,isLoggedIn, catchAsync(campgroundsControllers.editForm))

module.exports = router;
