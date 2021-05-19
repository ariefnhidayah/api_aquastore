const express = require('express');
const router = express.Router();

const verifyTokenSeller = require('../middlewares/verify_token_seller')

const SellerController = require('../controllers/v1/SellerController')

router.post('/register', SellerController.register)
router.post('/login', SellerController.login)
router.post('/update', verifyTokenSeller, SellerController.update)
router.post('/send-email', verifyTokenSeller, SellerController.send_email)
router.post('/activation', verifyTokenSeller, SellerController.activation_code)

module.exports = router;
