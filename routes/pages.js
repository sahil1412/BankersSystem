const express = require('express');
var session = require('express-session');
const router = express.Router();
const passport = require('passport');

router.get('/', (req, res) => {
    res.render('index');
});

router.get('/register', (req, res) => {
    res.render('register');
});
router.use(passport.initialize());
router.use(passport.session());

router.get('/login', (req, res) => {
    res.render('login');
});
router.get('/loginBanker', (req, res) => {
    res.render('loginBanker');
});
router.get('/profile', (req, res) => {
    res.render('profile');
});
router.get('/logout', (req, res) => {

    res.redirect('/');
})
router.get('/bankerprofile', (req, res) => {
    res.render('bankerprofile');
});
router.get('/list', (req, res) => {
    res.render('list');
});
router.get('/bankerlogout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
})


module.exports = router;