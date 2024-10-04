const express = require('express');
const UserController = require('../../ports/userController');
const authMiddleware = require('../../middleweres/verifyToken');
const { userService } = require('../../core/services/userService');

const router = express.Router();
const userController = new UserController(userService);

router.post('/register', (req, res) => userController.register(req, res));
router.post('/login', (req, res) => userController.login(req, res));


module.exports = router;