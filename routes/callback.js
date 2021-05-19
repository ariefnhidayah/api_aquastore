const express = require('express');
const router = express.Router();

const Callback = require('../controllers/v1/Callback')

router.post('/', Callback.callback)

module.exports = router;
