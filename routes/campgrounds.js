const express = require('express');
const router = express.Router({mergeParams: true});
const catchAsync = require('../utils/catchAsync')
const expressError = require('../utils/expressError')
const Campground = require('../models/campground')
const Reviews = require('../models/review')
const {campgroundSchema, reviewSchema} = require('../campgroundSchemas')
const {isLoggedIn} = require('../middleware')

const validatorBody = function(req, res, next){		
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

router.get('/', async (req, res)=>{
	const camp = await Campground.find({});
	res.render('campgrounds/index.ejs', { camp })
})

router.get('/new', isLoggedIn, async (req, res)=>{
	res.render('campgrounds/new.ejs');
})

router.get('/:id', catchAsync(async (req, res)=>{
	const { id } = req.params;
	const campgroundSelected = await Campground.findById(id).populate('reviews');
	// o populate serve para buscar a "tabela" que possui relacionamento com o campground ou seja vai buscar os comentarios da postagem selecionada
	res.render('campgrounds/show.ejs', { campgroundSelected });
}))

router.get('/:id/edit', isLoggedIn, catchAsync(async (req, res)=>{
	const { id } = req.params;
	const campgroundSelected = await Campground.findById(id);
	res.render('campgrounds/edit.ejs', { campgroundSelected });
}))

router.post('/', isLoggedIn, catchAsync(async(req, res, next)=>{
	const {title, location, price, description, image} = req.body.campground;
	const newCampground = new Campground({title: title, location:location, price: price, image: image, description: description});
	await newCampground.save();
	req.flash('success', 'Campground created with exit!!!')
	res.redirect(`/campgrounds/${newCampground._id}`);
	console.log(newCampground)
}))

router.put('/:id', isLoggedIn, validatorBody, catchAsync(async (req, res)=>{
		const { id } = req.params;
	    const {title, location, image, price, description} = req.body.campground;
        const updated = await Campground.findByIdAndUpdate(id, {title: title, location: location, price: price, image: image, description: description })
		req.flash('success', 'Campground updated!!!')
	    res.redirect(`/campgrounds/${updated._id}`);
		}))

router.delete('/:id', isLoggedIn, catchAsync(async (req, res)=>{
	    const {id} = req.params;
	    const deletado = await Campground.findByIdAndDelete(id);
	    console.log()
	    res.redirect('/campgrounds')
}));

module.exports = router;
