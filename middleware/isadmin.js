const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");

module.exports = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        if (!authHeader?.startsWith('Bearer ')) {
            return res.status(401).json({ 
                status: "error",
                error: "Unauthorized request" 
            });
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Verify the user is actually an admin
        const admin = await Admin.findById(decoded.id);
        if (!admin || admin.role !== 'admin') {
            return res.status(403).json({ 
                status: "error",
                error: "Admin access required" 
            });
        }

        req.admin = {
            id: admin._id,
            email: admin.email,
            permissions: admin.permissions,
            adminLevel: admin.adminLevel
        };
        
        next();
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ 
                status: "error",
                error: "Token expired" 
            });
        }
        return res.status(401).json({ 
            status: "error",
            error: "Unauthorized request" 
        });
    }
};