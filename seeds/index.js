const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];


const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 10; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            //YOUR USER ID
            author: '5fd4198473348406cdf4ec78',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam dolores vero perferendis laudantium, consequuntur voluptatibus nulla architecto, sit soluta esse iure sed labore ipsam a cum nihil atque molestiae deserunt!',
            price,
            geometry: {
                type: "Point",
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude,
                ]
            },
            image: [
                {
                    url: 'https://res.cloudinary.com/dyflenlim/image/upload/v1608399661/YelpCamp/vjfphju4wbltlxyc5co1.jpg',
                    filename: 'YelpCamp/vjfphju4wbltlxyc5co1'
                },
                {
                    url: 'https://res.cloudinary.com/dyflenlim/image/upload/v1608399722/YelpCamp/fpbpsjzjxqypb7qs5mur.jpg',
                    filename: 'YelpCamp/fpbpsjzjxqypb7qs5mur'
                }
            ]
        })
        await camp.save();
		console.log(camp)
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})