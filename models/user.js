const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    fullname: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true, select: false ,minlength:6,max_length:8},
    username: { type: String, required: true, lowercase: true,max_length:8 },
    role: { type: String, enum: ['admin', 'staff', 'student'], default: 'student'},
    verified: { type: Boolean, default: false },
    verification_code: { type: String, select: false },
    verification_code_expires: { type: Date, select: false }
}, { timestamps: true });

userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    
    try {
        const salt = await bcrypt.genSalt(13);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (err) {
        next(err);
    }
});

userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

// module.exports = mongoose.model("user", userSchema);
module.exports = mongoose.models.user || mongoose.model('user', userSchema);