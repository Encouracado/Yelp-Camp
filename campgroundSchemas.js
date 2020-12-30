const baseJoi = require('joi')
const sanitizeHtml = require('sanitize-html')
const extension = (joi)=>({
	type: 'string',
	base: joi.string(),
	messages:{
		'string.escapeHTML': '{{#label}} must not include HTML!'
	},
	rules: {
		escapeHTML:{
			validate(value, helpers){
				const clean = sanitizeHtml(value,{
					allowedTags: [],
					allowedAttributes:{},
				});
				if(clean !== value) return helpers.error('string.escapeHTML', { value })
				 return clean;
			}
		}
	}
	
})


const Joi = baseJoi.extend(extension);

module.exports.campgroundSchema = // O pacote Joi precisa criar um esquema para que voce lance o que cada tipo de entrada precisa ter para ser validado
	Joi.object({
		  campground : Joi.object({
		  title: Joi.string().required().escapeHTML(),
		  price: Joi.number().min(0).required(),
		  //image: Joi.string(),
		  location: Joi.number().required().escapeHTML(),
		  description: Joi.string().required().escapeHTML()
	})
	});

module.exports.reviewSchema = Joi.object({
	review: Joi.object({
		rating: Joi.number().required(),
		body: Joi.string().required().escapeHTML()	
	}).required()
}) 