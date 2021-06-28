const express = require('express');
const router = express.Router();
const passport = require('passport');
const catchTryAsync = require('../utilities/catchTryAsync');
const User = require('../models/user');

router.get('/register', (req, res) => {
    res.render('users/register');
});

router.post('/register', catchTryAsync(async(req, res) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const regUser = await User.register(user, password);
        req.login(regUser, err => {
            if (err) return next(err);
            req.flash('success', `Bienvenidos, ${username}.`);
            res.redirect('/burritos');
        })
    } catch(err) {
        req.flash('error', err.message)
        res.redirect('/register');
    }
}));

router.get('/login', (req, res) => {
    res.render('users/login');
});

router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), (req, res) => {
    req.flash('success', 'Good to see you again!');
    res.redirect('/burritos');
});

router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success', 'Adios...')
    res.redirect('/burritos')
});

module.exports = router;