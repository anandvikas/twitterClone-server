const express = require('express')
const router = express.Router();

const controllers = require('../controllers/user');
const userAuthMiddleware = require('../middleware/userAuthMiddleware')

router.post('/', controllers.create);
router.post('/sign-in', controllers.signIn);
router.post('/sign-in-auto', controllers.autoSignIn);
router.post('/forget-password', controllers.forgotPassword);
router.post('/reset-password', controllers.resetPassword);
router.get('/:userName', controllers.getUser);
router.put('/', userAuthMiddleware, controllers.updateUser);
router.put('/follow', userAuthMiddleware, controllers.followUser);
router.put('/un-follow', userAuthMiddleware, controllers.unFollowUser);

module.exports = router;