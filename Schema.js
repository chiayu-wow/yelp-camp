const baseJoi  = require('joi')
const sanitizeHtml = require('sanitize-html');
const htmlSanitizer = (joi) => ({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.sanitizeHTML': '{{#label}} contains disallowed HTML content!',
    },
    rules: {
        sanitizeHTML: {
            validate(value, helpers) {
                const sanitizedValue = sanitizeHtml(value, {
                    allowedTags: [],
                    allowedAttributes: {}
                });
                if (sanitizedValue !== value) {
                    return helpers.error('string.sanitizeHTML', { value });
                }
                return sanitizedValue;
            }
        }
    }
});

const Joi = baseJoi.extend(htmlSanitizer);

//for validation
module.exports.CampgroundSchema = Joi.object({
    campground_title : Joi.string().required().sanitizeHTML(),
    campground_price : Joi.number().required().min(0),
    //campground_image : Joi.string().required(),
    campground_location : Joi.string().required().sanitizeHTML(),
    campground_description : Joi.string().required().sanitizeHTML(),
    DeleteImages : Joi.array()
})


module.exports.ReviewsSchema = Joi.object({
    Review_body : Joi.string().required().sanitizeHTML(),
    Review_rating : Joi.number().required().min(1).max(5)
})