const express = require('express');
const router = express.Router();
const { getOwnerDashboard } = require('../controllers/ownerController');
const authenticate = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

router.get('/dashboard', authenticate, roleCheck('store_owner'), getOwnerDashboard);

module.exports = router;