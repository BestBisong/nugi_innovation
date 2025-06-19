const Admin = require('../models/Admin');
const mongoose = require('mongoose')

module.exports = {
    async init() {
        try {
            await mongoose.connect(process.env.MONGO_URI);
            console.log("Database connected successfully");

            // Check/create super admin
            const adminExists = await Admin.findOne({
                email: process.env.INITIAL_ADMIN_EMAIL,
            });
            
            if (!adminExists && process.env.INITIAL_ADMIN_EMAIL) {
                const admin = new Admin({
                    email: process.env.INITIAL_ADMIN_EMAIL,
                    password: process.env.INITIAL_ADMIN_PASSWORD,
                    fullname: 'System Admin',
                    username: process.env.INITIAL_ADMIN_USERNAME || 'admin',
                    adminLevel: 'super',
                    role: 'admin'
                });
                
                await admin.save();
                console.log("Super admin created successfully");
            }
        } catch (err) {
            console.error("Database initialization error:", err);
        }
    }
};