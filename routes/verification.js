const express = require('express');
const router = express.Router();
const VerificationController = require('../controllers/verification.controller');
const validator = require('../middleware/validator.middleware');
const authMiddleware = require('../middleware/auth.middleware');

router.post('/initiate', 
    authMiddleware,
    VerificationController.initiateVerification
);

router.post('/verify', 
    authMiddleware,
    validator(VerificationController.verificationSchema),
    VerificationController.verifyUser
);

module.exports = router;