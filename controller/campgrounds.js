const Campground = require('../models/campground');
const {cloudinary} = require('../cloudinary/index')
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding')
const MapboxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({accessToken : MapboxToken})
module.exports.index = async (req, res)=>{
    const campgrounds = await Campground.find({})
    res.render('campground/index',{campgrounds})
}

module.exports.createCampgrounds = async (req, res,next)=>{
    const data = req.body;
    const Data = await geocoder.forwardGeocode({
        query : data.campground_location,
        limit : 1
    }).send()
    const new_campground = new Campground({
        title : data.campground_title,
        location : data.campground_location,
        price : data.campground_price,
        description : data.campground_description,
    })
    new_campground.author = req.user._id;
    new_campground.images = req.files.map( f => ({imgUrl : f.path, filename : f.filename}))
    new_campground.geometry = Data.body.features[0].geometry
    console.log(new_campground)
    await new_campground.save()
    req.flash('success', 'successfully create a campground')
    res.redirect(`/campgrounds/${new_campground._id}`)
}

module.exports.renderNewForm = (req, res) => { 
    res.render('campground/new')  
}

module.exports.getSpecificCamp = async (req,res)=>{
    const {id} = req.params;
    // retrieve a campground document by its ID from the database 
    // and populate its reviews field with their respective authors.
    const data = await Campground.findById(id).populate({
        path : 'reviews',
        populate : {
            path : 'author'
        }
    }).populate('author')
    if(!data){
        req.flash('error', 'cannot find that campground')
        res.redirect('/campgrounds')
    }
    res.render('campground/show',{data})
}

module.exports.deleteCampground = async (req,res)=>{
    const {id} = req.params
    await Campground.findByIdAndDelete(id)
    req.flash("success", "successfully delete campground")
    res.redirect("/campgrounds")
}

module.exports.updateCampground = async (req,res)=>{
    const {id} = req.params
    const data = req.body;
    console.log(data)
    const campground = await Campground.findByIdAndUpdate(id, ({
        title : data.campground_title,
        location : data.campground_location,
        price : data.campground_price,
        description : data.campground_description
    }))
    const imgs = req.files.map( f => ({imgUrl : f.path, filename : f.filename}))
    campground.images.push(...imgs);
    await campground.save();
    if(data.DeleteImages){
        for(let filename of data.DeleteImages){
            await cloudinary.uploader.destroy(filename)
        }
        await campground.updateOne({$pull :{ images : { filename : { $in : data.DeleteImages}}}})
    }
    req.flash("success", "successfully update campground")
    res.redirect(`/campgrounds/${id}`)
}

module.exports.renderEditForm = async (req,res)=>{
    const {id} = req.params;
    const data = await Campground.findById(id)
    res.render('campground/edit', {data})
}