const Staff = require('../models/Staff');
const Joi = require('joi');

module.exports = class StaffController {
    static async createStaff(req, res, next) {
        try {
            const staff = new Staff(req.body);
            await staff.save();
            res.status(201).json({ 
                status: "success",
                staff 
            });
        } catch (err) {
            next(err);
        }
    }

    static async getAllStaff(req, res, next) {
        try {
            const staff = await Staff.find().populate('course');
            res.json({ 
                status: "success",
                staff 
            });
        } catch (err) {
            next(err);
        }
    }

    static async getStaff(req, res, next) {
        try {
            const staff = await Staff.findById(req.params.id).populate('course');
            if (!staff) return res.status(404).json({ 
                status: "error",
                message: "Staff not found" 
            });
            res.json({ 
                status: "success",
                staff 
            });
        } catch (err) {
            next(err);
        }
    }

    static async updateStaff(req, res, next) {
        try {
            const staff = await Staff.findByIdAndUpdate(req.params.id, req.body, { new: true });
            if (!staff) return res.status(404).json({ 
                status: "error",
                message: "Staff not found" 
            });
            res.json({ 
                status: "success",
                staff 
            });
        } catch (err) {
            next(err);
        }
    }

    static async deleteStaff(req, res, next) {
        try {
            const staff = await Staff.findByIdAndDelete(req.params.id);
            if (!staff) return res.status(404).json({ 
                status: "error",
                message: "Staff not found" 
            });
            res.json({ 
                status: "success",
                message: "Staff deleted successfully" 
            });
        } catch (err) {
            next(err);
        }
    }

    static get staffSchema() {
        return Joi.object({
            fullname: Joi.string().required(),
            email: Joi.string().email().required(),
            phone: Joi.string().required(),
            course: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
            profileImage: Joi.string(),
            role: Joi.string().valid('staff', 'teacher').default('staff'),
            status: Joi.string().valid('active', 'inactive').default('active')
        });
    }
};