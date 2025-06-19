    const nodemailer = require('nodemailer');
    const crypto = require('crypto');

    // Configure with explicit SMTP settings
    const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
        type: 'LOGIN',
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
    });

    function generateRandomPassword() {
    return crypto.randomBytes(8).toString('hex');//16 length password
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
        <p>change your password immediately.</p>`
    };

    try {
        await transporter.sendMail(mailOptions);
        return true;
    } catch (error) {
        console.error('Failed to send email:', error);// to catch error
        return false;
    }
    }

    module.exports = { generateRandomPassword, sendCredentialsEmail };