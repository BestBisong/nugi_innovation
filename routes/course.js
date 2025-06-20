const express = require('express');
const router = express.Router();
const CourseController = require('../controllers/course.controller');
const validator = require('../middleware/validator.middleware');
const authMiddleware = require('../middleware/auth.middleware');

router.post('/create', authMiddleware, validator(CourseController.courseSchema), CourseController.createCourse);
router.get('/getAllCourses', CourseController.getAllCourses);
router.get('/:id', CourseController.getCourse);

module.exports = router;