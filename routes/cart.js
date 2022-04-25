const express = require('express');
const router = express.Router();

const verifyToken = require('../middlewares/verify_token_user')

const CartController = require('../controllers/v1/CartController')

router.post('/', verifyToken, CartController.add)
router.put('/:id', verifyToken, CartController.update)
router.delete('/:id', verifyToken, CartController.delete)
router.get('/', verifyToken, CartController.get_all)
router.get('/check-stock', verifyToken, CartController.check_stock)

module.exports = router;
