const express = require('express');
const router = express.Router();
const EnrollmentController = require('../controllers/enrollment.controller');
const authMiddleware = require('../middleware/auth.middleware');

router.post('/:courseId/enroll/:studentId', 
    authMiddleware,
    EnrollmentController.enrollStudent
);

router.post('/:courseId/unenroll/:studentId', 
    authMiddleware,
    EnrollmentController.unenrollStudent
);

router.get('/:courseId/students', 
    authMiddleware,
    EnrollmentController.getEnrolledStudents
);

module.exports = router;