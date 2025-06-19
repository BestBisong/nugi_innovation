const Student = require('../models/Student');
const { generateRandomPassword, sendCredentialsEmail } = require('../utils/mailer');
const User = require('../models/user');
const Joi = require('joi');
const bcrypt = require('bcryptjs');

module.exports = class StudentController {
    static async createStudent(req, res, next) {
        try {
            const { email, fullname, phone, course } = req.body;
            
            // Generate temporary password
            const tempPassword = generateRandomPassword();
            const hashedPassword = await bcrypt.hash(tempPassword, 12);
            const username = email.split('@')[0].toLowerCase().substring(0, 8);
            const registrationDate = Date.now();

            // const existingUser = await Student.findB(email).populate('student')

            // if (existingUser) {
            //     return res.status(400).json({
            //     status: "failure",
            //     message: "Student already exist",
            //     data: null
            //     })
            // }
            // Create user account
            const user = new User({
                email,
                password: hashedPassword,
                fullname,
                username,
                role: 'student',
                mustChangePassword: true
            });

            // Create student profile
            const student = new Student({
                user: user._id,
                fullname,
                email,
                phone,
                registrationDate: new Date(),
                course
            });

            await Promise.all([user.save(), student.save()]);
            
            // Send credentials
            await sendCredentialsEmail(email, tempPassword, 'Student');

            return res.status(201).json({
                status: "success",
                message: "Student created and credentials emailed",
                data: student
            });
        } catch (error) {
            next(error);
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
            username:Joi.string().required(),
            password:Joi.string(),
            phone: Joi.string().required(),
            address: Joi.string(),
            course: Joi.string().regex(/^[0-9a-fA-F]{24}$/),//helps in character collection
            registrationDate: Joi.date(),
            profileImage: Joi.string(),
            status: Joi.string().valid('active', 'inactive')
        });
    }
};