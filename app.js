const express = require('express');
const path = require('path');
const app = express();
const mongoose = require('mongoose');
const Joi = require('joi');
const Campground = require('./models/campground')
const Reviews = require('./models/review')
const methodOverride = require('method-override')
const responseTime = require('response-time')
const ejsMate = require('ejs-mate')
const catchAsync = require('./utils/catchAsync')
const expressError = require('./utils/expressError')
const {campgroundSchema, reviewSchema} = require('./campgroundSchemas')
const campgroundsRouter = require('./routes/campgrounds')
const reviewRouter = require('./routes/reviews')
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const userRouter = require('./routes/user')

mongoose.connect('mongodb://localhost:27017/yelp-camp',{
	useNewUrlParser:true,
	useCreateIndex:true,
	useUnifiedTopology:true,
	useFindAndModify:false
	
})

const db = mongoose.connection;
db.on("error", ()=>console.log("erro de conexão"))
db.once("open",()=>{
	console.log("banco conectado")
})

app.engine('ejs', ejsMate);

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({extend:true}))
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')))

const sessionConfig = {
	secret: 'TheSecret',
	resave: false,
	saveUninitialized: true,
	cookie: {
		httpOnly: true,
		expires: Date.now + 1000 * 60 * 60 * 24 * 7,
		maxAge: 1000 * 60 * 60 * 24 * 7
	}
}

app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next)=>{
	res.locals.currentUser = req.user;
	res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.use('/campgrounds', campgroundsRouter);
app.use('/campgrounds/:id/reviews', reviewRouter);
app.use('/', userRouter);

app.get('/', (req, res)=>{
	res.render('home')
})

app.use((err, req, res, next)=>{
	// middleware para todo tipo de erro, ele pega o erro no paramentro e passa para a send
	const { statusCode= 500} = err;
	if(!err.message) err.message = 'Apllication failed'
	res.status(statusCode).render('error.ejs', { err })
	console.log(err)
});


app.all('*', (err, req, res, next)=>{
	//toda pagina nao comoputada cai nesse asteristico
	res.send(new expressError('page not found', '404'));
});


app.listen(3000, () => console.log("server on at the port 3000"))