const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');

const adminSchema = new mongoose.Schema({
    fullname: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true, select: false },
    username: { type: String, required: true, lowercase: true },
    permissions: {
        type: [String],
        default: ['manage_users', 'manage_content', 'system_settings']
    },
    adminLevel: {
        type: String,
        enum: ['super', 'regular', 'support'],
        default: 'regular'
    },
    role: { type: String, default: 'admin' },
    lastAccess: Date
}, { timestamps: true });

adminSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    
    try {
        const salt = await bcrypt.genSalt(13);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (err) {
        next(err);
    }
});

adminSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.models.Admin || mongoose.model('Admin', adminSchema);