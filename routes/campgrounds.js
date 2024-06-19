const express = require('express')
const Router = express.Router();
const {CampgroundSchema} = require('../Schema')
const campground = require('../controller/campgrounds')
const ExpressError = require('../utilities/ExpressError')
const CatchAsync =  require('../utilities/catchErrorAsync')
const {isLoggedIn, isAuthor} = require('../middleware')
const multer  = require('multer')
const {storage} = require('../cloudinary/index')
const upload = multer({ storage })

const validateCampground = (req, res, next)=>{
    const {error} = CampgroundSchema.validate(req.body)
    if(error){
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg,400)
    }else{
        next()
    }
}

Router.get("/", CatchAsync(campground.index))

Router.post("/", isLoggedIn, upload.array('image')  ,validateCampground ,CatchAsync(campground.createCampgrounds))


Router.get("/new", isLoggedIn , campground.renderNewForm)

Router.get("/:id" ,CatchAsync(campground.getSpecificCamp))

Router.delete("/:id", isLoggedIn , CatchAsync(campground.deleteCampground))

Router.put("/:id", isLoggedIn , isAuthor, upload.array('image') ,validateCampground, CatchAsync(campground.updateCampground))

Router.get("/:id/edit", isLoggedIn , isAuthor ,CatchAsync(campground.renderEditForm))


module.exports = Router