const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // use STARTTLS
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

const sendActivationEmail = async (toEmail, tempPassword) => {
    const mailOptions = {
        from: `"Agri Marketplace" <${process.env.EMAIL_USER}>`,
        to: toEmail,
        subject: 'Agri Marketplace Account Activation',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <h2 style="color: #059669;">Agri Marketplace Account Activation</h2>
                <p>Your account has been created by the platform administrator.</p>
                <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 16px; margin: 16px 0;">
                    <p style="margin: 4px 0;"><strong>Email:</strong> ${toEmail}</p>
                    <p style="margin: 4px 0;"><strong>Temporary Password:</strong> ${tempPassword}</p>
                </div>
                <p>Please activate your account by logging in with these credentials and setting a new password.</p>
                <p style="color: #6b7280; font-size: 12px; margin-top: 24px;">This is an automated message from Agri Marketplace. Do not reply.</p>
            </div>
        `,
    };
    await transporter.sendMail(mailOptions);
};

const sendOTPEmail = async (toEmail, otp) => {
    const mailOptions = {
        from: `"Agri Marketplace" <${process.env.EMAIL_USER}>`,
        to: toEmail,
        subject: 'Agri Marketplace - OTP Verification',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <h2 style="color: #059669;">OTP Verification</h2>
                <p>Use the following OTP to complete your account activation:</p>
                <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 16px; margin: 16px 0; text-align: center;">
                    <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #059669;">${otp}</span>
                </div>
                <p>This OTP expires in <strong>5 minutes</strong>.</p>
                <p style="color: #6b7280; font-size: 12px; margin-top: 24px;">If you did not request this, please ignore this email.</p>
            </div>
        `,
    };
    await transporter.sendMail(mailOptions);
};

module.exports = { sendActivationEmail, sendOTPEmail };
