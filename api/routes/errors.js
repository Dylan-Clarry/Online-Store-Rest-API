// ====================
// imports
// ====================
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const checkAuth = require('../middleware/check-auth');

// ====================
// controller
// ====================
const errorsController = require('../controllers/errorsController');

// ====================
// requests
// ====================

// get
router.get('/:error', errorsController.serveErrorPage);

// ====================
// exports
// ====================
module.exports = router;