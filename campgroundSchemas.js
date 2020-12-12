const Joi = require('joi')

module.exports.campgroundSchema = // O pacote Joi precisa criar um esquema para que voce lance o que cada tipo de entrada precisa ter para ser validado
	Joi.object({
		  campground : Joi.object({
		  title: Joi.string().required(),
		  price: Joi.number().min(0).required(),
		  image: Joi.string(),
		  location: Joi.number().required(),
		  description: Joi.string().required()
	}).required()
	});

module.exports.reviewSchema = Joi.object({
	review: Joi.object({
		rating: Joi.number().required(),
		body: Joi.string().required()	
	}).required()
}) 