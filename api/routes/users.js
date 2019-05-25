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
const usersController = require('../controllers/usersController');

// ====================
// models
// ====================

// ====================
// requests
// ====================

//////////
// GET
//////////

// get list of users
router.get('/getusers', checkAuth, usersController.getUsersList);

//////////
// POST
//////////

// login
router.post('/login', usersController.login);

// signup
router.post('/signup', checkAuth, usersController.signup);

// delete
router.post('/delete', checkAuth, usersController.delete);

// ====================
// exports
// ====================
module.exports = router;