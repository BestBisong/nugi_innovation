    const Joi = require('joi');
    const jwt = require('jsonwebtoken');
    const Admin = require('../models/Admin');
    const bcrypt = require('bcryptjs');
    const { generateRandomPassword, sendCredentialsEmail } = require('../utils/mailer');

    module.exports = class AdminController {
        static async login(req, res, next) {
            try {
                const { email, password } = req.body;

                const admin = await Admin.findOne({ email }).select('+password');
                if (!admin) {
                    return res.status(401).json({
                        status: "error",
                        message: "Invalid credentials"
                    });
                }

                const isMatch = await admin.comparePassword(password);
                if (!isMatch) {
                    return res.status(401).json({
                        status: "error",
                        message: "Invalid credentials"
                    });
                }

                const token = jwt.sign(
                    { 
                        id: admin._id, 
                        email: admin.email, 
                        role: admin.role,
                        permissions: admin.permissions,
                        adminLevel: admin.adminLevel 
                    },
                    process.env.JWT_SECRET,
                    { expiresIn: "1h" }
                );

                return res.json({ 
                    status: "success",
                    token,
                    admin: {
                        id: admin._id,
                        email: admin.email,
                        fullname: admin.fullname,
                        permissions: admin.permissions,
                        adminLevel: admin.adminLevel
                    }
                });
            } catch (error) {
                next(error);
            }
        }


    static async register(req, res, next) {
    try {
        // Verify admin privileges
        if (req.admin.adminLevel !== 'super') {
        return res.status(403).json({
            status: "error",
            message: "Only super admins can register users"
        });
        }

        const { email, fullname, role = 'student' } = req.body;
        
        // Generate temporary password
        const tempPassword = generateRandomPassword();
        const hashedPassword = await bcrypt.hash(tempPassword, 12);

        // Create user based on role
        let user;
        if (role === 'admin') {
        user = new Admin({
            email,
            password: hashedPassword,
            fullname,
            mustChangePassword: true
        });
        } else {
        user = new User({
            email,
            password: hashedPassword,
            fullname,
            role,
            mustChangePassword: true
        });
        }

        await user.save();
        

        const emailSent = await sendCredentialsEmail(email, tempPassword, role);
        
        if (!emailSent) {
        console.warn(`User ${email} created but email failed to send`);
        }

        return res.status(201).json({
        status: "success",
        message: "User created successfully. " + 
                (emailSent ? "Credentials sent via email." : "Failed to send email."),
        user: {
            id: user._id,
            email: user.email,
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
                adminLevel: Joi.string().valid('super', 'regular', 'support').default('regular')
            });
        }
    };