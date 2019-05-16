var express = require('express');
// var multer = require('multer');

 var controller = require('../../controllers/admin/comment.controller');
// var validate = require('../validate/user.validate');

// var upload = multer({ dest: './public/uploads/' });

var router = express.Router();

router.get('/product-comment/:id', controller.commentOfProductShow);

router.get('/product-comment', controller.productCommentShow);

module.exports = router;