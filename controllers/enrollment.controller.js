const Student = require('../models/Student');
const Course = require('../models/Course');
const Joi = require('joi');

module.exports = class EnrollmentController {
    static async enrollStudent(req, res, next) {
        try {
            const student = await Student.findByIdAndUpdate(
                req.params.studentId,
                { $addToSet: { courses: req.params.courseId } },
                { new: true }
            );
            
            if (!student) return res.status(404).json({ 
                status: "error",
                message: "Student not found" 
            });

            await Course.findByIdAndUpdate(
                req.params.courseId,
                { $addToSet: { students: req.params.studentId } }
            );

            res.json({ 
                status: "success",
                message: "Enrollment successful",
                student 
            });
        } catch (err) {
            next(err);
        }
    }

    static async unenrollStudent(req, res, next) {
        try {
            const student = await Student.findByIdAndUpdate(
                req.params.studentId,
                { $pull: { courses: req.params.courseId } },
                { new: true }
            );
            
            if (!student) return res.status(404).json({ 
                status: "error",
                message: "Student not found" 
            });

            await Course.findByIdAndUpdate(
                req.params.courseId,
                { $pull: { students: req.params.studentId } }
            );

            res.json({ 
                status: "success",
                message: "Unenrollment successful",
                student 
            });
        } catch (err) {
            next(err);
        }
    }

    static async getEnrolledStudents(req, res, next) {
        try {
            const course = await Course.findById(req.params.courseId)
                .populate('students', 'fullname email');
            
            if (!course) return res.status(404).json({ 
                status: "error",
                message: "Course not found" 
            });

            res.json({ 
                status: "success",
                students: course.students 
            });
        } catch (err) {
            next(err);
        }
    }
};