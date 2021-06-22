const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BurritoSchema = new Schema({
    title: String,
    picture: String,
    restaurant: String,
    location: String,
    price: Number,
    description: String,
    createdAt: {
        type: Date,
        default: Date.now,
    }
    // creator: {
    //     type: Schema.Types.ObjectId,
    //     ref: 'User'
    // },
});

module.exports = mongoose.model('Burrito', BurritoSchema);