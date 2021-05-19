const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/verify_token_user')

const CheckoutController = require('../controllers/v1/CheckoutController')

router.get('/get-cost', verifyToken, CheckoutController.get_cost)
router.post('/add-order', verifyToken, CheckoutController.order)
router.get('/json', CheckoutController.create_json)
router.post('/check-product', verifyToken, CheckoutController.check_product)

module.exports = router;
