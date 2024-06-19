const express = require('express')
const Router = express.Router({mergeParams : true});
const {CampgroundSchema, ReviewsSchema} = require('../Schema')
const review = require('../controller/reviews')
const ExpressError = require('../utilities/ExpressError')
const CatchAsync =  require('../utilities/catchErrorAsync')
const {isLoggedIn, isReviewAuthor} = require('../middleware')

const validateReviews = (req, res, next)=>{
    const {error} = ReviewsSchema.validate(req.body)
    if(error){
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg,400)
    }else{
        next()
    }
}

Router.post("/",isLoggedIn , validateReviews , CatchAsync(review.postReview))

Router.delete('/:ReviewID', isLoggedIn, isReviewAuthor ,CatchAsync(review.deleteReview))

module.exports = Router;