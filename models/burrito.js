const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BurritoSchema = new Schema({
    title: String,
    // picture: String,
    restaurant: String,
    location: String,
    price: Number,
    description: String,
    likes: Number,
    dislikes: Number,
    createdAt: {
        type: Date,
        default: Date.now,
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    likers: [],
    dislikers: []
});

module.exports = mongoose.model('Burrito', BurritoSchema);