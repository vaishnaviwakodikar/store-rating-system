const express = require('express');
const router = express.Router();
const { getAllStores } = require('../controllers/storeController');
const authenticate = require('../middleware/auth');

router.get('/', authenticate, getAllStores);

module.exports = router;