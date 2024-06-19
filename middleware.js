const Campground = require('./models/campground');
const Review = require('./models/review');

module.exports.isLoggedIn = (req, res ,next) =>{
    if(!req.isAuthenticated()){
        req.session.returnTo = req.originalUrl
        req.flash('error', 'you need to sign in first')
        return res.redirect('/login')
    }    
    next();
}

module.exports.isAuthor = async (req, res, next)=>{
    const {id} = req.params;
    const camp = await Campground.findById(id);
    //check if current user have permisson or not
    if(!camp.author[0]._id.equals(req.user._id)){
        req.flash('error', 'you dont have permission to modify it')
        return res.redirect(`/campgrounds/${id}`)
    }
    next()
}

module.exports.isReviewAuthor = async (req, res, next)=>{
    const { id, ReviewID} = req.params;
    const review = await Review.findById(ReviewID);
    //check if current user have permisson or not
    if(!review.author[0]._id.equals(req.user._id)){
        req.flash('error', 'you dont have permission to modify it')
        return res.redirect(`/campgrounds/${id}`)
    }
    next()
}

