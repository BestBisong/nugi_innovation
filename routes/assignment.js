const express = require('express');
const router = express.Router();
const AssignmentController = require('../controllers/assignment.controller');
const validator = require('../middleware/validator.middleware');
const authMiddleware = require('../middleware/auth.middleware');

// Student routes
router.post('/submit', 
    authMiddleware,
    validator(AssignmentController.assignmentSchema),
    AssignmentController.submitAssignment
);

router.get('/my-assignments', 
    authMiddleware,
    AssignmentController.getAssignments
);

// Teacher/admin routes
router.put('/grade/:id', 
    authMiddleware,
    validator(AssignmentController.gradingSchema),
    AssignmentController.gradeAssignment
);

router.get('/', 
    authMiddleware,
    AssignmentController.getAssignments
);

router.get('/:id', 
    authMiddleware,
    AssignmentController.getAssignment
);

module.exports = router;