const Assignment = require('../models/Assignment');
const Joi = require('joi');

module.exports = class AssignmentController {
    static async submitAssignment(req, res, next) {
        try {
            const assignment = new Assignment({
                ...req.body,
                submittedBy: req.user.id,
                status: 'submitted'
            });
            await assignment.save();
            res.status(201).json({ 
                status: "success",
                assignment 
            });
        } catch (err) {
            next(err);
        }
    }

    static async gradeAssignment(req, res, next) {
        try {
            const assignment = await Assignment.findByIdAndUpdate(
                req.params.id,
                { 
                    grade: req.body.grade,
                    feedback: req.body.feedback,
                    status: 'graded' 
                },
                { new: true }
            );
            if (!assignment) return res.status(404).json({ 
                status: "error",
                message: "Assignment not found" 
            });
            res.json({ 
                status: "success",
                assignment 
            });
        } catch (err) {
            next(err);
        }
    }

    static async getAssignments(req, res, next) {
        try {
            const assignments = await Assignment.find()
                .populate('submittedBy', 'fullname email');
            res.json({ 
                status: "success",
                assignments 
            });
        } catch (err) {
            next(err);
        }
    }

    static async getAssignment(req, res, next) {
        try {
            const assignment = await Assignment.findById(req.params.id)
                .populate('submittedBy', 'fullname email');
            if (!assignment) return res.status(404).json({ 
                status: "error",
                message: "Assignment not found" 
            });
            res.json({ 
                status: "success",
                assignment 
            });
        } catch (err) {
            next(err);
        }
    }

    static get assignmentSchema() {
        return Joi.object({
            title: Joi.string().required(),
            description: Joi.string().required(),
            dueDate: Joi.date().required(),
            file: Joi.string().required()
        });
    }

    static get gradingSchema() {
        return Joi.object({
            grade: Joi.number().min(0).max(100).required(),
            feedback: Joi.string().required()
        });
    }
};