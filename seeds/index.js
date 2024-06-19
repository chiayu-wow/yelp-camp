const mongoose = require('mongoose');
const Campground = require('../models/campground')
const cities = require("./cities")
const {descriptors, places} = require('./seedsHelpers')
const accessKey = "amWniuxcCNRsq-_9FHz41MH-oaEy0KtwuFGLF_6FdTo"
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

main()
    .then(()=>{
        console.log("connected");
    })
    .catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp'); // use the movieApp database
  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}

const SeedDB = async ()=>{
    await Campground.deleteMany({})
    for(let i = 0; i< 50; i++){
        const random1000 = Math.floor(Math.random()*1000)
        const random18 = Math.floor(Math.random()*18)
        const price = Math.floor(Math.random()*18)+30
        const response = await fetch(`https://api.unsplash.com/collections/483251/photos?client_id=${accessKey}`);
        const data = await response.json();
    
        const shuffledData = shuffleArray(data);
        const randomPhoto = shuffledData[0];
        const camp = new Campground({
            author : '65d36aff556f8e9de2e62a4d',
            location : `${cities[random1000].city} , ${cities[random1000].state} `,
            title : `${descriptors[random18]} ${places[random18]}`,
            images : [
              {
                imgUrl: 'https://res.cloudinary.com/dfeb1m0ws/image/upload/v1717572288/YelpCamp/r8v8qvixgs1plqyamcfb.jpg',
                filename: 'YelpCamp/r8v8qvixgs1plqyamcfb',
              },
              {
                imgUrl: 'https://res.cloudinary.com/dfeb1m0ws/image/upload/v1717572288/YelpCamp/mac7u1sctoc029ktsnop.jpg',
                filename: 'YelpCamp/mac7u1sctoc029ktsnop',
              },
              {
                imgUrl: 'https://res.cloudinary.com/dfeb1m0ws/image/upload/v1717572288/YelpCamp/q4owdzmceydxp45lr3ue.jpg',
                filename: 'YelpCamp/q4owdzmceydxp45lr3ue',
              }
            ],
            description : "Ummmmmmmmm",
            geometry: { type: 'Point', coordinates: [ cities[random1000].longitude, cities[random1000].latitude ] },
            price : price
        })
        await camp.save()
    }

}

function shuffleArray(array) {
    let currentIndex = array.length, randomIndex;
  
    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
  
    return array;
  }

SeedDB()