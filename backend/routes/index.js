const express   = require('express');
let router      = express.Router()
let user        = require('../controllers/userController')
const mw        = require('../middlewares/response.middleware');
const email     = require('../controllers/emailController');
const contact   = require('../controllers/contactController');
const feedback  = require('../controllers/feedbackController');
const report    = require('../controllers/reportController');


router.post('/api/register',user.collectToRegister, user.register,mw.respond,mw.error);
router.post('/api/login', user.collectToAuthenticate,user.authenticate,mw.respond,mw.error);
router.post('/api/subscribe', email.collectToEmail, email.subscribe, mw.respond, mw.error);
router.post('/api/request/ether', email.collectToEmail, email.requestEther, mw.respond, mw.error);
router.post('/api/request/bitcoin', email.collectToEmail, email.requestBitcoin, mw.respond, mw.error);
router.post('/api/contact', contact.collectToEmail, contact.contact, mw.respond, mw.error);
router.post('/api/feedback', feedback.collectToEmail, feedback.feedback, mw.respond, mw.error);
router.post('/api/report-feedback', report.collectToEmail, report.report, mw.respond, mw.error);

module.exports = router;

