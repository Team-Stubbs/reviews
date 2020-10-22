const mongoose = require('mongoose');

var reviewSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  product_id: Number,
  review: {
    rating: Number,
    date: String,
    summary: String,
    body: String,
    recommend: Boolean,
    reported:  Boolean,
    reviewer_name: String,
    reviewer_email: String,
    response: String,
    helpfulness: Number
  }
})

var Review = mongoose.model('Review', reviewSchema);
module.exports = Review;