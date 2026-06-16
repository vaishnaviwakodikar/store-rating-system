const express = require('express');
const router = express.Router();
const { getDashboard, addUser, getAllUsers, getAllStores, addStore } = require('../controllers/adminController');
const authenticate = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');
const validateUser = require('../middleware/validate');

router.use(authenticate, roleCheck('admin'));

router.get('/dashboard', getDashboard);
router.post('/users', validateUser, addUser);
router.get('/users', getAllUsers);
router.get('/stores', getAllStores);
router.post('/stores', addStore);

module.exports = router;