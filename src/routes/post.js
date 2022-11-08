const express = require('express')
const router = express.Router();
const {
    upload
} = require('../helper/helper')

const controllers = require('../controllers/post');
const userAuthMiddleware = require('../middleware/userAuthMiddleware')

router.post('/',
    userAuthMiddleware,
    upload.fields([{ name: "postPics", maxCount: 10 },]),
    controllers.createPost
);

router.post('/reTweet',
    userAuthMiddleware,
    controllers.reTweet
);

router.post('/like',
    userAuthMiddleware,
    controllers.likePost
);

router.delete('/',
    userAuthMiddleware,
    controllers.deletePost
);

module.exports = router;