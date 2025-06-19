const Joi = require('joi');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const bcrypt = require('bcryptjs');

module.exports = class AuthController {
        static async login(req, res, next) {
        try {
            const { email, password } = req.body;

            const user = await User.findOne({ email }).select('+password');
            if (!user) {
                return res.status(401).json({ message: "Invalid credentials" });
            }

            const isMatch = await user.comparePassword(password);
            if (!isMatch) {
                return res.status(401).json({ message: "Invalid credentials" });
            }

            const token = jwt.sign(
                { id: user._id, email: user.email, role: user.role },
                process.env.JWT_SECRET,
                { expiresIn: "1h" }
            );

            return res.json({ 
                status: "success",
                statusCode: 200,
                token,
                user: {
                    id: user._id,
                    email: user.email,
                    fullname: user.fullname,
                    role: user.role
                }
            });
        } catch (error) {
            next(error);
        }
    }


    static async register(req, res, next) {
        try {
            // Check if requester is admin
            if (req.user.role !== 'admin') {
                return res.status(403).json({ 
                    status: "error",
                    message: "Only admins can register users" 
                });
            }

            const { email, password, fullname, role = 'student' } = req.body;

            // Check if user already exists
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ 
                    status: "error",
                    message: "User already exists" 
                });
            }

            // Hash password
            const hashedPassword = await bcrypt.hash(password, 13);

            // Create new user
            const user = new User({
                email,
                password: hashedPassword,
                fullname,
                role
            });

            await user.save();

            return res.status(201).json({ 
                status: "success",
                message: "User registered successfully",
                user: {
                    id: user._id,
                    email: user.email,
                    fullname: user.fullname,
                    role: user.role
                }
            });
        } catch (error) {
            next(error);
        }
    }

    static get loginSchema() {
        return Joi.object({
            email: Joi.string().email().required(),
            password: Joi.string().required()

        });
    }

    static get registerSchema() {
        return Joi.object({
            email: Joi.string().email().required(),
            password: Joi.string().min(6).required(),
            fullname: Joi.string().required(),
            role: Joi.string().valid('student', 'teacher').default('student')
        });
    }
};