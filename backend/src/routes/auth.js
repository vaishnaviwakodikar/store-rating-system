const express = require('express');
const router = express.Router();
const { register, login, updatePassword } = require('../controllers/authController');
const authenticate = require('../middleware/auth');
const validateUser = require('../middleware/validate');

router.post('/register', validateUser, register);
router.post('/login', login);
router.put('/update-password', authenticate, validateUser, updatePassword);

module.exports = router;