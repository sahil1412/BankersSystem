const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');

router.post('/register', authController.register);

router.post('/login', authController.login);

router.post('/loginBanker', authController.loginBanker);

router.post('/list', authController.list);

router.delete('profile', authController.delete);

router.put('/deposit', authController.deposit);

module.exports = router;
