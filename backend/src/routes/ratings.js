const express = require('express');
const router = express.Router();
const { submitRating } = require('../controllers/ratingController');
const authenticate = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

router.post('/', authenticate, roleCheck('user'), submitRating);

module.exports = router;