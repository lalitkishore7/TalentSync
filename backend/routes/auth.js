const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/authController');

// Clean and isolated routes leveraging the controller logic
router.post('/register', registerUser);
router.post('/login', loginUser);

module.exports = router;
