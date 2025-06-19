    const nodemailer = require('nodemailer');
    const crypto = require('crypto');


    // Configure with explicit SMTP settings
    const transporter = nodemailer.createTransport({
    host: 'bisongbest04gmail.com',
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
        type: 'LOGIN', // Explicitly specify auth type
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
    });

    function generateRandomPassword() {
    return crypto.randomBytes(8).toString('hex'); 
    }

    async function sendCredentialsEmail(email, password, userType) {
    const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: email,
        subject: `Your ${userType} Account Credentials`,
        html: `
        <h2>Welcome to Our Platform!</h2>
        <p>Your ${userType} account has been created by an administrator.</p>
        <p><strong>Login Email:</strong> ${email}</p>
        <p><strong>Temporary Password:</strong> ${password}</p>
        <p>Please <a href="${process.env.APP_URL}/login">login</a> and change your password immediately.</p>
        <p>If you didn't request this, please contact support.</p>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        return true;
    } catch (error) {
        console.error('Failed to send email:', error);
        return false;
    }
    }

    module.exports = { generateRandomPassword, sendCredentialsEmail };