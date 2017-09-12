const express   = require('express');
let router      = express.Router()
let user        = require('../controllers/userController')
const mw        = require('../middlewares/response.middleware');
const email     = require('../controllers/emailController');
const contact   = require('../controllers/contactController');
const feedback  = require('../controllers/feedbackController');
const report    = require('../controllers/reportController');

router.post('/register',user.collectToRegister, user.register,mw.respond,mw.error);
router.post('/login', user.collectToAuthenticate,user.authenticate,mw.respond,mw.error);
router.post('/subscribe', email.collectToEmail, email.subscribe, mw.respond, mw.error);
router.post('/request/ether', email.collectToEmail, email.requestEther, mw.respond, mw.error);
router.post('/request/bitcoin', email.collectToEmail, email.requestBitcoin, mw.respond, mw.error);
router.post('/contact', contact.collectToEmail, contact.contact, mw.respond, mw.error);
router.post('/feedback', feedback.collectToEmail, feedback.feedback, mw.respond, mw.error);
router.post('/report-feedback', report.collectToEmail, report.report, mw.respond, mw.error);

module.exports = router

