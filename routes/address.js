const express = require('express');
const router = express.Router();

const verifyTokenUser = require('../middlewares/verify_token_user')

const addressController = require('../controllers/v1/AddressController')

router.post('/', verifyTokenUser, addressController.add)
router.put('/:id', verifyTokenUser, addressController.update)
router.delete('/:id', verifyTokenUser, addressController.delete)
router.get('/', verifyTokenUser, addressController.get_list)
router.get('/:id', verifyTokenUser, addressController.get)

module.exports = router;
