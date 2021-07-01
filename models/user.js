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
// I really need to get this project done so I can move onto React.  MVC has taken me forever wrap my head around.  Never touched the backend before so I suppose thats understandable.
// I'm going to make a schedule and break the rest of this thing up into chunks so that I have a definative time-line and goals to meet.
// Maybe one week to get the rest of the key features operational.
// 1. Figure out how to make an account only allow 1 like/disklike.
// 2. Authorize likes/dislikes when logged in, hide when not.
// One week to ensure responsive design/really tighten up the design.
// And last week to deploy.

