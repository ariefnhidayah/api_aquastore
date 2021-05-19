const express = require('express');
const router = express.Router();

const addressController = require('../controllers/v1/AddressController')
const verifyTokenUser = require('../middlewares/verify_token_user')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/province', addressController.provincies)
router.get('/city', addressController.cities)
router.get('/district', addressController.districts)

router.put('/change-primary-address/:id', verifyTokenUser, addressController.change_address)

module.exports = router;
