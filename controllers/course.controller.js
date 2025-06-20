const Course = require('../models/Course');
const Joi = require('joi');

module.exports = class CourseController {
    static async createCourse(req, res, next) {
        try {
            const course = new Course(req.body);
            await course.save();
            res.status(201).json(course);
        } catch (err) {
            next(err);
        }
    }

    static async getAllCourses(req, res, next) {
        try {
            const courses = await Course.find();
            res.json(courses);
        } catch (err) {
            next(err);
        }
    }

    static async getCourse(req, res, next) {
        try {
            const course = await Course.findById(req.params.id);
            if (!course) return res.status(404).json({ message: "Course not found" });
            res.json(course);
        } catch (err) {
            next(err);
        }
    }

    static get courseSchema() {
        return Joi.object({
            name: Joi.string().required(),
            lessons: Joi.number().required(),
            duration: Joi.string().required(),
            description: Joi.string(),
            course:Joi.string(),
            image: Joi.string()
        });
    }
};