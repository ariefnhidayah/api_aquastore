const express = require('express');
const router = express.Router();

const SellerController = require('../controllers/v1/SellerController')
router.get('/:seo_url', SellerController.detail)

module.exports = router;