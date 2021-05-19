const express = require('express');
const router = express.Router();

const ProductController = require('../controllers/v1/ProductController')

router.get('/', ProductController.get_list)
router.get('/:seo_url', ProductController.get)


module.exports = router;
