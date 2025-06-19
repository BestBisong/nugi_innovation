const express = require('express');
const router = express.Router();
const validator = require('../middleware/validator.middleware');
const AdminController = require('../controllers/admin.controller');
const isAdmin = require('../middleware/isadmin');

// Admin login
router.post('/login',
    validator(AdminController.loginSchema),
    AdminController.login
);

// Admin registration (protected by isAdmin middleware)
router.post('/register',
    isAdmin,
    validator(AdminController.registerSchema),
    AdminController.register
);

// Protected admin route example
router.get('/dashboard', 
    isAdmin,
    (req, res) => {
        res.json({ 
            status: "success",
            message: "Welcome to admin dashboard",
            admin: req.admin 
        });
    }
);

module.exports = router;