const express = require('express');
const router = express.Router();
const StaffController = require('../controllers/staff.controller');
const validator = require('../middleware/validator.middleware');
const authMiddleware = require('../middleware/auth.middleware');
const isAdmin = require('../middleware/isadmin');

router.post('/', 
    authMiddleware, 
    isAdmin,
    validator(StaffController.staffSchema), 
    StaffController.createStaff
);

router.get('/', 
    authMiddleware, 
    StaffController.getAllStaff
);

router.get('/:id', 
    authMiddleware, 
    StaffController.getStaff
);

router.put('/:id', 
    authMiddleware, 
    isAdmin,
    validator(StaffController.staffSchema), 
    StaffController.updateStaff
);

router.delete('/:id', 
    authMiddleware, 
    isAdmin,
    StaffController.deleteStaff
);

module.exports = router;