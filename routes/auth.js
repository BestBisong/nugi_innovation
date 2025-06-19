const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/auth.controller');
const validator = require('../middleware/validator.middleware');
const authMiddleware = require('../middleware/auth.middleware');

router.post("/login", validator(AuthController.loginSchema), AuthController.login);
router.post("/register", authMiddleware, validator(AuthController.registerSchema), AuthController.register);

module.exports = router;