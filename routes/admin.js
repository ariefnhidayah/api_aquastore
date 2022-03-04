const express = require('express');
const router = express.Router();

const adminController = require('../controllers/v1/AdminController')

router.post('/login', adminController.login)
router.post('/register', adminController.register)

module.exports = router;
