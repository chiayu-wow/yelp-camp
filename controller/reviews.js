const Review = require('../models/review');
const Campground = require('../models/campground');

module.exports.postReview = async (req, res)=>{
    const campground = await Campground.findById(req.params.id)
    const review = new Review({
        body : req.body.Review_body,
        rating : req.body.Review_rating
    })
    review.author = req.user._id
    campground.reviews.push(review)
    await review.save()
    await campground.save()
    req.flash("success", "successfully create review")
    res.redirect(`/campgrounds/${campground._id}`)
}

module.exports.deleteReview = async (req, res)=>{
    const {id, ReviewID} = req.params;
    await Campground.findByIdAndUpdate(id, {$pull : {reviews : ReviewID}})//uses the $pull operator, which removes all occurrences of a specified value from an array. 
    await Review.findByIdAndDelete(ReviewID)
    req.flash("success", "successfully delete review")
    res.redirect(`/campgrounds/${id}`)
}