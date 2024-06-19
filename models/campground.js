const mongoose = require('mongoose');
const Review = require('./review')
const a = 9;

const Schema = mongoose.Schema;
const opts = { toJSON: { virtuals: true } };
const CampgroundSchema = new Schema({
    title : String,
    images : [
        {
            imgUrl : String,
            filename : String
        }
    ],
    price : Number,
    description : String,
    geometry : {
        type: {
          type: String, // Don't do `{ location: { type: String } }`
          enum: ['Point'], // 'location.type' must be 'Point'
          required: true
        },
        coordinates: {
          type: [Number],
          required: true
        }
      },
    author : [
        {
            type : Schema.Types.ObjectId,
            ref :'User'
        }
    ],
    reviews : [
        {
            type : Schema.Types.ObjectId,
            ref : "Review"
        }
    ]
},opts)

CampgroundSchema.virtual('properties.popUpText').get(function(){
    return `<a href="/campgrounds/${this._id}">${this.title}</a>`
})

CampgroundSchema.post('findOneAndDelete',async (doc)=>{
    if(doc){
        await Review.deleteMany({
            _id : {
                $in : doc.reviews
            }
        })
    }
})

module.exports = mongoose.model("Campground", CampgroundSchema)