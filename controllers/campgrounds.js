const Campground = require('../models/campground');
const expressError = require('../utils/expressError')
const mpbGeoCoding = require('@mapbox/mapbox-sdk/services/geocoding.js')
const mapboxToken = process.env.MAPBOX_TOKEN;

const geocoder = mpbGeoCoding({accessToken: mapboxToken});

module.exports.renderIndex = async (req, res)=>{
	const camp = await Campground.find({});
	res.render('campgrounds/index.ejs', { camp })
};

module.exports.renderFormNewCampground = async (req, res)=>{
	res.render('campgrounds/new.ejs');
}

module.exports.showOneCampground = async (req, res)=>{
	const { id } = req.params;
	console.log(req.params)
	const campgroundSelected = await Campground.findById(id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
	// o populate serve para buscar a "tabela" que possui relacionamento com o campground ou seja vai buscar os comentarios da postagem selecionada
	
	res.render('campgrounds/show.ejs', { campgroundSelected });
};

module.exports.editForm = async (req, res)=>{
	const { id } = req.params;
	const campgroundSelected = await Campground.findById(id);
	res.render('campgrounds/edit.ejs', { campgroundSelected });
};

module.exports.postNewCampground =  async(req, res, next)=>{

	const geoData = await geocoder.forwardGeocode({
    query: req.body.campground.location,
    limit: 2
  }).send()
	
	//res.send()

	const {title, location, price, description, image} = req.body.campground;
	const newCampground = new Campground({title: title, location:location, price: price, image: image, description: description});
	newCampground.geometry = geoData.body.features[0].geometry;
	newCampground.image = req.files.map(f =>({url: f.path, filename: f.filename}))
	newCampground.author = req.user._id;
	await newCampground.save();
	console.log(newCampground)
	req.flash('success', 'Campground created with exit!!!')
	res.redirect(`/campgrounds/${newCampground._id}`);
};

module.exports.putEditCampground = async (req, res)=>{
		const { id } = req.params;
	    console.log(req.params, req.body)
        const updated = await Campground.findByIdAndUpdate(id, {...req.body.campground })
		const imagens = req.files.map(f =>({url: f.path, filename: f.filename}))
		console.log(imagens)
		updated.image.push(...imagens)
	    await updated.save();
		req.flash('success', 'Campground updated!!!')
	    res.redirect(`/campgrounds/${updated._id}`);
		};

module.exports.deleteCampground = async (req, res)=>{
	    const {id} = req.params;
	    const deletado = await Campground.findByIdAndDelete(id);
	    res.redirect('/campgrounds')
};

