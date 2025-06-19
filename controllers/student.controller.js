const Student = require('../models/Student');
const Joi = require('joi');

module.exports = class StudentController {
    static async createStudent(req, res, next) {
        try {
            const student = new Student(req.body);
            await student.save();
            res.status(201).json(student);
        } catch (err) {
            next(err);
        }
    }

    static async getAllStudents(req, res, next) {
        try {
            const students = await Student.find().populate('course');
            res.json(students);
        } catch (err) {
            next(err);
        }
    }

    static async getStudent(req, res, next) {
        try {
            const student = await Student.findById(req.params.id).populate('course');
            if (!student) return res.status(404).json({ message: "Student not found" });
            res.json(student);
        } catch (err) {
            next(err);
        }
    }

    static get studentSchema() {
        return Joi.object({
            fullname: Joi.string().required(),
            email: Joi.string().email().required(),
            phone: Joi.string().required(),
            address: Joi.string(),
            course: Joi.string().regex(/^[0-9a-fA-F]{24}$/),//helps in character collection
            registrationDate: Joi.date().required(),
            profileImage: Joi.string(),
            status: Joi.string().valid('active', 'inactive')
        });
    }
};