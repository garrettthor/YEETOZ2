const express = require('express');
const router = express.Router();
const app = express();
const { validateBurrito, ensureLoggedIn } = require('../middleware');
// The catchTryAsync refers to a function which passes error handling through next and down to the error route
const catchTryAsync = require('../utilities/catchTryAsync');
const ExpressError = require('../utilities/ExpressError');
const Burrito = require('../models/burrito');

router.get('/', catchTryAsync(async(req, res) => {
    const burritoList = await Burrito.find({});
    burritoList.sort((a, b) => b.createdAt-a.createdAt);
    res.render('burritos/feed', { burritoList });
}));

router.get('/new', ensureLoggedIn, (req, res) => {
    res.render('burritos/new');
});

router.post('/', ensureLoggedIn, validateBurrito, catchTryAsync(async(req, res, next) => {
    req.flash('success', 'A wild Burrito has appeared!');
    const burrito = new Burrito(req.body.burrito);
    burrito.author = req.user._id;
    console.log(burrito)
    await burrito.save();
    res.redirect('burritos');
}));

router.get('/:id', catchTryAsync(async(req, res) => {
    const burrito = await (await Burrito.findById(req.params.id)).populate('author');
    console.log(burrito)
    if(!burrito) {
        req.flash('error', 'Burrito doesn\'t exist...');
        return res.redirect('/burritos');
    }
    res.render('burritos/display', { burrito })
}));

router.get('/:id/edit', ensureLoggedIn, catchTryAsync(async(req, res) => {
    const { id } = req.params;
    const burrito = await Burrito.findById(id);
    res.render(`burritos/edit`, { burrito })
}));

router.put('/:id', ensureLoggedIn, validateBurrito, catchTryAsync(async(req, res) => {
    req.flash('success', 'Burrito edit accepted!')
    const { id } = req.params;
    const burrito = await Burrito.findByIdAndUpdate(id, { ...req.body.burrito });
    res.redirect(`${burrito._id}`)
}));

router.put('/megusta/:id', ensureLoggedIn, catchTryAsync(async(req, res,) => {
    req.flash('success', 'Me gusta...')
    const { id } = req.params;
    const currentUser = req.user;
    if(currentUser){
        const burrito = await Burrito.findByIdAndUpdate(id, 
            { $inc: {likes: 1}} )
    }
    res.redirect('back');
}));

router.put('/yeet/:id', ensureLoggedIn, catchTryAsync(async(req, res,) => {
    req.flash('success', 'No te gusta...')
    const { id } = req.params;
    const currentUser = req.user;
    if(currentUser){
        const burrito = await Burrito.findByIdAndUpdate(id, 
            { $inc: {dislikes: 1}} )
    }
    res.redirect('back');
}));

router.delete('/:id', ensureLoggedIn, catchTryAsync(async(req, res) => {
    req.flash('success', 'Burrito yeeted!')
    const { id } = req.params;
    const burrito = await Burrito.findByIdAndDelete(id);
    res.redirect('/burritos')
}));

module.exports = router;