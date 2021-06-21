const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    }
})
UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);

//
// fixing squaress
// There was a bit of post-bday depression/anxiety to overcome...
// I had a little imposter syndrome/encounted some gatekeeping on reddit that shook my confidence a little.