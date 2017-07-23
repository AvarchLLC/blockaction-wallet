const express = require('express');
let router = express.Router()
let user = require('../controllers/userController')
const mw = require('../middlewares/response.middleware');
const email = require('../controllers/emailController');

router.post('/register',user.collectToRegister, user.register,mw.respond,mw.error);
router.post('/login', user.collectToAuthenticate,user.authenticate,mw.respond,mw.error);
router.post('/subscribe', email.collectToEmail, email.subscribe, mw.respond, mw.error);
router.post('/request/ether', email.collectToEmail, email.requestEther, mw.respond, mw.error);

module.exports = router

