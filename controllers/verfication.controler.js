const User = require('../models/user');
const Joi = require('joi');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

module.exports = class VerificationController {
    static async initiateVerification(req, res, next) {
        try {
            const user = await User.findById(req.user.id);
            if (!user) return res.status(404).json({ 
                status: "error",
                message: "User not found" 
            });

            if (user.verified) return res.status(400).json({ 
                status: "error",
                message: "User already verified" 
            });

            // Generate verification code
            const verificationCode = crypto.randomBytes(3).toString('hex').toUpperCase();
            const expiresAt = new Date(Date.now() + 3600000); // 1 hour from now

            user.verification_code = verificationCode;
            user.verification_code_validation = expiresAt;
            await user.save({ validateBeforeSave: false });

            // Send verification email
            await this.sendVerificationEmail(user.email, verificationCode);

            res.json({ 
                status: "success",
                message: "Verification code sent to your email" 
            });
        } catch (err) {
            next(err);
        }
    }

    static async verifyUser(req, res, next) {
        try {
            const { code } = req.body;
            const user = await User.findOne({
                _id: req.user.id,
                verification_code: code,
                verification_code_validation: { $gt: Date.now() }
            });

            if (!user) return res.status(400).json({ 
                status: "error",
                message: "Invalid or expired verification code" 
            });

            user.verified = true;
            user.verification_code = undefined;
            user.verification_code_validation = undefined;
            await user.save();

            res.json({ 
                status: "success",
                message: "Account verified successfully" 
            });
        } catch (err) {
            next(err);
        }
    }

    static async sendVerificationEmail(email, code) {
        const transporter = nodemailer.createTransport({
            service: process.env.EMAIL_SERVICE,
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD
            }
        });

        const mailOptions = {
            from: process.env.EMAIL_FROM,
            to: email,
            subject: 'Account Verification Code',
            text: `Your verification code is: ${code}\nThis code will expire in 1 hour.`,
            html: `<p>Your verification code is: ${code}</p>`
        };

        await transporter.sendMail(mailOptions);
    }

    static get verificationSchema() {
        return Joi.object({
            code: Joi.string().length(6).required()
        });
    }
};