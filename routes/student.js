const express = require('express');
const router = express.Router();
const StudentController = require('../controllers/student.controller');
const validator = require('../middleware/validator.middleware');
const authMiddleware = require('../middleware/auth.middleware');

router.post('/register', authMiddleware, validator(StudentController.studentSchema), StudentController.createStudent);
router.get('/getstudent', authMiddleware, StudentController.getAllStudents);
router.get('/check:id', authMiddleware, StudentController.getStudent);

module.exports = router;