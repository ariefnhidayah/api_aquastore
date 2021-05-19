const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/verify_token_user')

const OrdersController = require('../controllers/v1/OrdersController')

router.get('/get', verifyToken, OrdersController.get)
router.get('/', verifyToken, OrdersController.get_list)

module.exports = router;
