const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    get.render('index');
});

router.get('/register', (req, res) => {
    get.render('register');
});
router.get('/login', (req, res) => {
    get.render('login');
});

module.exports = router;
