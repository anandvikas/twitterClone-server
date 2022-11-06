const express = require('express')
const router = express.Router();

const controllers = require('../controllers/user');

router.post('/', controllers.create);
router.post('/sign-in', controllers.signIn);
router.post('/sign-in-auto', controllers.autoSignIn);
router.post('/forget-password', controllers.forgotPassword);
router.post('/reset-password', controllers.resetPassword);
router.get('/:userName', controllers.getUser);

module.exports = router;