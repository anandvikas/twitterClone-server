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
    controllers.postGuide
);

module.exports = router;