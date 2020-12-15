const Campground = require('../models/campground');

module.exports.renderIndex = async (req, res)=>{
	const camp = await Campground.find({});
	res.render('campgrounds/index.ejs', { camp })
};

module.exports.renderFormNewCampground = async (req, res)=>{
	res.render('campgrounds/new.ejs');
}

module.exports.showOneCampground = async (req, res)=>{
	const { id } = req.params;
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
	const {title, location, price, description, image} = req.body.campground;
	const newCampground = new Campground({title: title, location:location, price: price, image: image, description: description});
	newCampground.author = req.user._id;
	await newCampground.save();
	req.flash('success', 'Campground created with exit!!!')
	res.redirect(`/campgrounds/${newCampground._id}`);
	console.log(newCampground)
};

module.exports.putEditCampground = async (req, res)=>{
		const { id } = req.params;
	    const {title, location, image, price, description} = req.body.campground;
        const updated = await Campground.findByIdAndUpdate(id, {title: title, location: location, price: price, image: image, description: description })
		req.flash('success', 'Campground updated!!!')
	    res.redirect(`/campgrounds/${updated._id}`);
		};

module.exports.deleteCampground = async (req, res)=>{
	    const {id} = req.params;
	    const deletado = await Campground.findByIdAndDelete(id);
	    res.redirect('/campgrounds')
};

