const express = require('express');
const router = express.Router();

const verifyTokenAdmin = require('../middlewares/verify_token_admin')
const categoryController = require('../controllers/v1/CategoryController')

router.get('/', categoryController.get_list)
router.get('/:id', categoryController.get)
router.post('/', verifyTokenAdmin, categoryController.add)
router.put('/:id', verifyTokenAdmin, categoryController.update)
router.delete('/:id', verifyTokenAdmin, categoryController.delete)

module.exports = router;
