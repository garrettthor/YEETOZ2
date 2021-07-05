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
// 3. Fix the NaN % total rating thing...
// 4. Cloudinary and image upload.  Especially camera access for mobile.
// One week to ensure responsive design/really tighten up the design.
// 1. Where are the like/dislike buttons going at mobile aspect?
// And last week to deploy.
// 1. Get up on Heroku, I assume?

