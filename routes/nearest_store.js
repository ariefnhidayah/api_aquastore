const express = require('express');
const router = express.Router();

const SellerController = require('../controllers/v1/SellerController')
router.get('/', SellerController.nearest_store)

module.exports = router;