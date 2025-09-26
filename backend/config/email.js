const nodemailer = require('nodemailer');
require('dotenv').config();

class EmailService {
    constructor() {
        this.transporter = null;
        this.initializeTransporter();
    }

    initializeTransporter() {
        // You can use different email services. Here are some options:

        // Option 1: Gmail (for development/testing)
        if (process.env.EMAIL_SERVICE === 'gmail') {
            this.transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_APP_PASSWORD // Use App Password, not regular password
                }
            });
        }
        // Option 2: SMTP (for custom email servers)
        else if (process.env.EMAIL_SERVICE === 'smtp') {
            this.transporter = nodemailer.createTransport({
                host: process.env.SMTP_HOST,
                port: process.env.SMTP_PORT || 587,
                secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
                auth: {
                    user: process.env.SMTP_USER,
                    pass: process.env.SMTP_PASS
                }
            });
        }
        // Option 3: SendGrid
        else if (process.env.EMAIL_SERVICE === 'sendgrid') {
            this.transporter = nodemailer.createTransport({
                service: 'SendGrid',
                auth: {
                    user: 'apikey',
                    pass: process.env.SENDGRID_API_KEY
                }
            });
        }
        // Option 4: Development mode (no actual email sending)
        else {
            console.log('📧 Email service not configured. OTP will be logged to console only.');
            this.transporter = null;
        }
    }

    async sendOTPEmail(email, otp, userName = 'User') {
        try {
            // If no email service configured, just log to console
            if (!this.transporter) {
                console.log(`📧 [DEV MODE] OTP Email would be sent to: ${email}`);
                console.log(`📧 [DEV MODE] OTP Code: ${otp}`);
                return { success: true, message: 'OTP logged to console (development mode)' };
            }

            const mailOptions = {
                from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
                to: email,
                subject: 'SafeBite - Password Reset OTP',
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                        <div style="text-align: center; margin-bottom: 30px;">
                            <h1 style="color: #2c3e50; margin: 0;">SafeBite</h1>
                            <p style="color: #7f8c8d; margin: 5px 0;">Food Safety Monitoring System</p>
                        </div>
                        
                        <div style="background-color: #f8f9fa; padding: 30px; border-radius: 10px; margin-bottom: 20px;">
                            <h2 style="color: #2c3e50; margin-top: 0;">Password Reset Request</h2>
                            <p style="color: #34495e; line-height: 1.6;">
                                Hello ${userName},
                            </p>
                            <p style="color: #34495e; line-height: 1.6;">
                                You have requested to reset your password for your SafeBite account. 
                                Please use the following One-Time Password (OTP) to verify your identity:
                            </p>
                            
                            <div style="text-align: center; margin: 30px 0;">
                                <div style="display: inline-block; background-color: #3498db; color: white; padding: 15px 30px; border-radius: 8px; font-size: 24px; font-weight: bold; letter-spacing: 3px;">
                                    ${otp}
                                </div>
                            </div>
                            
                            <p style="color: #34495e; line-height: 1.6;">
                                <strong>Important:</strong>
                            </p>
                            <ul style="color: #34495e; line-height: 1.6;">
                                <li>This OTP is valid for 10 minutes only</li>
                                <li>Do not share this code with anyone</li>
                                <li>If you didn't request this password reset, please ignore this email</li>
                            </ul>
                        </div>
                        
                        <div style="text-align: center; color: #7f8c8d; font-size: 12px;">
                            <p>This is an automated message. Please do not reply to this email.</p>
                            <p>&copy; 2024 SafeBite. All rights reserved.</p>
                        </div>
                    </div>
                `,
                text: `
                    SafeBite - Password Reset OTP
                    
                    Hello ${userName},
                    
                    You have requested to reset your password for your SafeBite account.
                    Please use the following One-Time Password (OTP) to verify your identity:
                    
                    OTP Code: ${otp}
                    
                    Important:
                    - This OTP is valid for 10 minutes only
                    - Do not share this code with anyone
                    - If you didn't request this password reset, please ignore this email
                    
                    This is an automated message. Please do not reply to this email.
                    © 2024 SafeBite. All rights reserved.
                `
            };

            const result = await this.transporter.sendMail(mailOptions);
            console.log('📧 OTP Email sent successfully:', result.messageId);
            
            return { 
                success: true, 
                message: 'OTP sent successfully',
                messageId: result.messageId 
            };

        } catch (error) {
            console.error('📧 Email sending failed:', error);
            return { 
                success: false, 
                message: 'Failed to send email',
                error: error.message 
            };
        }
    }

    async sendWelcomeEmail(email, userName) {
        try {
            if (!this.transporter) {
                console.log(`📧 [DEV MODE] Welcome email would be sent to: ${email}`);
                return { success: true, message: 'Welcome email logged to console (development mode)' };
            }

            const mailOptions = {
                from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
                to: email,
                subject: 'Welcome to SafeBite!',
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                        <div style="text-align: center; margin-bottom: 30px;">
                            <h1 style="color: #2c3e50; margin: 0;">Welcome to SafeBite!</h1>
                            <p style="color: #7f8c8d; margin: 5px 0;">Food Safety Monitoring System</p>
                        </div>
                        
                        <div style="background-color: #f8f9fa; padding: 30px; border-radius: 10px;">
                            <h2 style="color: #2c3e50; margin-top: 0;">Hello ${userName}!</h2>
                            <p style="color: #34495e; line-height: 1.6;">
                                Welcome to SafeBite! Your account has been successfully created.
                            </p>
                            <p style="color: #34495e; line-height: 1.6;">
                                You can now start monitoring your food safety with our advanced sensor technology and AI-powered analysis.
                            </p>
                            
                            <div style="text-align: center; margin: 30px 0;">
                                <p style="color: #34495e; line-height: 1.6;">
                                    You can now access your SafeBite dashboard to start monitoring your food safety.
                                </p>
                            </div>
                        </div>
                    </div>
                `
            };

            const result = await this.transporter.sendMail(mailOptions);
            console.log('📧 Welcome email sent successfully:', result.messageId);
            
            return { success: true, message: 'Welcome email sent successfully' };

        } catch (error) {
            console.error('📧 Welcome email sending failed:', error);
            return { success: false, message: 'Failed to send welcome email' };
        }
    }
}

module.exports = new EmailService();
