// ====================
// imports
// ====================
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');


// ====================
// controller
// ====================
const contactController = require('../controllers/contactController');

// ====================
// requests
// ====================

// POST
router.post('/send', contactController.sendEmailRequest);


// ====================
// exports
// ====================
module.exports = router;