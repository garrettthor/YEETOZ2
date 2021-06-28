const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const passportLocal = require('passport-local');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const ExpressError = require('./utilities/ExpressError');
const moment = require('moment');
const PORT = 1984;

const User = require('./models/user');

// Route requirements
const burritosRoutes = require('./routes/burritoRoutes')
const userRoutes = require('./routes/userRoutes');


//------------Database Connection----------------------
mongoose.connect('mongodb://localhost:27017/yeetoz2', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Error de conexión:'));
db.once('open', () => {
    console.log(`Hola, estamos conectados a ${db.name}.`);
});
//------------End db connection stuff------------------


// Middleware and express stuff
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('_method'));
const sessionConfig = {
    secret: 'changethissecretlater',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + (1000 * 60 * 60 * 24 * 7),  // 1 week expiration
        maxAge: (1000 * 60 * 60 * 24 * 7)
    }
    // store:
}

// Session and flash
app.use(session(sessionConfig));
app.use(flash());

//Passport and local strategy
app.use(passport.initialize());
app.use(passport.session());
passport.use(new passportLocal(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// This middleware makes moment.js work.  Don't ask me how, thats some stackoverflow copypasta magic babay
app.use((req, res, next) => {
    res.locals.moment = moment;
    next();
})

// This middleware makes the flash messages available everywhere w a local variable
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});

// ROUTING
//Set burritos routes
app.use('/burritos', burritosRoutes);
app.use('/', userRoutes);

// Routes
app.get('/', (req, res) => {
    res.render('home');
});



// Error handling
app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
});

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No!  Something Went Terribly Wrong!';
    res.status(statusCode).render('error', { err });
});

// LISTEN
app.listen(1984, () => {
    console.log(`Escuchando a port: ${PORT}`)
});