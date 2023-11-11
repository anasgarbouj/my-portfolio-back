const express = require('express');
const userController = require('../controllers/users');
const router = express.Router();
// Signup route
router.post('/signup', userController.signup);

// Signin route
router.post('/signin', userController.signin);

// Get a single user by id
router.get('/:id', userController.getUser);

// Update a user by id
router.put('/:id', userController.updateUser);

// Delete a user by id
router.delete('/:id', userController.deleteUser);

// List all users
router.get('/', userController.listUsers);

module.exports = router;
