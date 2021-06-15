const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
// The catchTryAsync refers to a function which passes error handling through next and down to the error route
const catchTryAsync = require('./utilities/catchTryAsync');
const ExpressError = require('./utilities/ExpressError');
const moment = require('moment');
const Burrito = require('./models/burrito');
const PORT = 1984;


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

// This middleware makes moment.js work.  Don't ask me how, thats some stackoverflow copypasta magic babay
app.use((req, res, next) => {
    res.locals.moment = moment;
    next();
})


// Routes
app.get('/', (req, res) => {
    res.render('home');
});

app.get('/burritos', catchTryAsync(async(req, res) => {
    const burritoList = await Burrito.find({});
    burritoList.sort((a, b) => b.createdAt-a.createdAt);
    res.render('burritos/feed', { burritoList });
}));

app.get('/burritos/new', (req, res) => {
    res.render('burritos/new');
});

app.post('/burritos', catchTryAsync(async(req, res, next) => {
        if(!req.body.burrito) throw new ExpressError('That\'s not a real burrito...', 400);
        const burrito = new Burrito(req.body.burrito);
        await burrito.save();
        res.redirect('burritos');
}));

app.get('/burritos/:id', catchTryAsync(async(req, res) => {
    const burrito = await(Burrito.findById(req.params.id));
    res.render('burritos/display', { burrito })
}));

app.get('/burritos/:id/edit', catchTryAsync(async(req, res) => {
    const { id } = req.params;
    const burrito = await Burrito.findById(id);
    res.render(`burritos/edit`, { burrito })
}));

app.put('/burritos/:id', catchTryAsync(async(req, res) => {
    const { id } = req.params;
    const burrito = await Burrito.findByIdAndUpdate(id, { ...req.body.burrito });
    res.redirect(`${burrito._id}`)
}));

app.delete('/burritos/:id', catchTryAsync(async(req, res) => {
    const { id } = req.params;
    const burrito = await Burrito.findByIdAndDelete(id);
    res.redirect('/burritos')
}));

// Error handling


app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
});

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Whoopsies... something went wrong...'
    res.status(statusCode).render('error', { err });
});

// LISTEN
app.listen(1984, () => {
    console.log(`Escuchando a port: ${PORT}`)
});