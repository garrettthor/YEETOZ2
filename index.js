const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
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

// This middleware makes moment work.  Don't ask me how, thats some stackoverflow copypasta magic babay
app.use((req, res, next) => {
    res.locals.moment = moment;
    next();
})


// Routes
app.get('/', (req, res) => {
    res.render('home');
});

app.get('/burritos', async(req, res) => {
    const burritoList = await Burrito.find({});
    burritoList.sort((a, b) => b.createdAt-a.createdAt);
    res.render('burritos/feed', { burritoList });
});

app.get('/burritos/new', (req, res) => {
    res.render('burritos/new');
});

app.post('/burritos', async(req, res) => {
    const burrito = new Burrito(req.body.burrito);
    await burrito.save();
    res.redirect('burritos');
});

app.get('/burritos/:id', async(req, res) => {
    const burrito = await(Burrito.findById(req.params.id));
    res.render('burritos/display', { burrito })
});

app.get('/burritos/:id/edit', async(req, res) => {
    const { id } = req.params;
    const burrito = await Burrito.findById(id);
    res.render(`burritos/edit`, { burrito })
});

app.put('/burritos/:id', async(req, res) => {
    const { id } = req.params;
    const burrito = await Burrito.findByIdAndUpdate(id, { ...req.body.burrito });
    res.redirect(`${burrito._id}`)
});

app.delete('/burritos/:id', async(req, res) => {
    const { id } = req.params;
    const burrito = await Burrito.findByIdAndDelete(id);
    console.log(burrito)
    res.redirect('/burritos')
});

// LISTEN
app.listen(1984, () => {
    console.log(`Escuchando a port: ${PORT}`)
});