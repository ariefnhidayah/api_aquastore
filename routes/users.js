const express = require('express');
const router = express.Router();

const verifyTokenUser = require('../middlewares/verify_token_user')

const UserController = require('../controllers/v1/UserController')

router.post('/login', UserController.login)
router.post('/register', UserController.register)
router.post('/update', verifyTokenUser, UserController.update)
router.post('/send-email', verifyTokenUser, UserController.send_email)
router.post('/activation', verifyTokenUser, UserController.activation_code)
router.get('/check-expired', verifyTokenUser, UserController.check_expired)

module.exports = router;
