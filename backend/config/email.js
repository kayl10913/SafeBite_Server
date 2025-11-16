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

    async sendVerificationEmail(email, otp, userName = 'User') {
        try {
            if (!this.transporter) {
                console.log(`📧 [DEV MODE] Verification email would be sent to: ${email}`);
                console.log(`📧 [DEV MODE] Verification Code: ${otp}`);
                return { success: true, message: 'Verification code logged to console (development mode)' };
            }

            const mailOptions = {
                from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
                to: email,
                subject: 'SafeBite - Verify your email',
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                        <div style="text-align: center; margin-bottom: 30px;">
                            <h1 style="color: #2c3e50; margin: 0;">SafeBite</h1>
                            <p style="color: #7f8c8d; margin: 5px 0;">Email Verification</p>
                        </div>
                        <div style="background-color: #f8f9fa; padding: 30px; border-radius: 10px; margin-bottom: 20px;">
                            <p style="color: #34495e; line-height: 1.6;">Hello ${userName},</p>
                            <p style="color: #34495e; line-height: 1.6;">Use this code to verify your email:</p>
                            <div style="text-align: center; margin: 30px 0;">
                                <div style="display: inline-block; background-color: #10b981; color: white; padding: 15px 30px; border-radius: 8px; font-size: 24px; font-weight: bold; letter-spacing: 3px;">
                                    ${otp}
                                </div>
                            </div>
                            <p style="color: #34495e; line-height: 1.6;">
                                This code expires in 10 minutes.
                            </p>
                        </div>
                        <div style="text-align: center; color: #7f8c8d; font-size: 12px;">
                            <p>This is an automated message. Please do not reply to this email.</p>
                            <p>&copy; 2024 SafeBite. All rights reserved.</p>
                        </div>
                    </div>
                `,
                text: `SafeBite verification code: ${otp} (valid for 10 minutes)`
            };

            const result = await this.transporter.sendMail(mailOptions);
            return { success: true, message: 'Verification email sent', messageId: result.messageId };
        } catch (error) {
            console.error('📧 Verification email failed:', error);
            return { success: false, message: 'Failed to send verification email', error: error.message };
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
            
            return { success: true, message: 'Welcome email sent successfully' };

        } catch (error) {
            console.error('📧 Welcome email sending failed:', error);
            return { success: false, message: 'Failed to send welcome email' };
        }
    }

    async sendContactFormEmail(contactData) {
        try {
            if (!this.transporter) {
                console.log('📧 [DEV MODE] Contact form email would be sent:');
                console.log('   Name:', contactData.name);
                console.log('   Email:', contactData.email);
                console.log('   Message:', contactData.message);
                console.log('   To: dinewatchph@gmail.com');
                return { success: true, message: 'Contact form email logged to console (development mode)' };
            }

            const mailOptions = {
                from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
                to: 'dinewatchph@gmail.com', // Your business email
                subject: `New Contact Form Message from ${contactData.name}`,
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                        <div style="text-align: center; margin-bottom: 30px;">
                            <h1 style="color: #2c3e50; margin: 0;">SafeBite</h1>
                            <p style="color: #7f8c8d; margin: 5px 0;">New Contact Form Message</p>
                        </div>
                        
                        <div style="background-color: #f8f9fa; padding: 30px; border-radius: 10px; margin-bottom: 20px;">
                            <h2 style="color: #2c3e50; margin-top: 0;">Contact Details</h2>
                            
                            <div style="margin-bottom: 20px;">
                                <strong style="color: #2c3e50;">Name:</strong>
                                <p style="color: #34495e; margin: 5px 0; padding: 10px; background-color: white; border-radius: 5px;">
                                    ${contactData.name}
                                </p>
                            </div>
                            
                            <div style="margin-bottom: 20px;">
                                <strong style="color: #2c3e50;">Email:</strong>
                                <p style="color: #34495e; margin: 5px 0; padding: 10px; background-color: white; border-radius: 5px;">
                                    <a href="mailto:${contactData.email}" style="color: #3498db; text-decoration: none;">
                                        ${contactData.email}
                                    </a>
                                </p>
                            </div>
                            
                            <div style="margin-bottom: 20px;">
                                <strong style="color: #2c3e50;">Message:</strong>
                                <div style="color: #34495e; margin: 5px 0; padding: 15px; background-color: white; border-radius: 5px; line-height: 1.6; white-space: pre-wrap;">
                                    ${contactData.message}
                                </div>
                            </div>
                        </div>
                        
                        <div style="text-align: center; color: #7f8c8d; font-size: 12px;">
                            <p>This message was sent from the SafeBite contact form.</p>
                            <p>Reply directly to this email to respond to ${contactData.name}.</p>
                            <p>&copy; 2024 SafeBite. All rights reserved.</p>
                        </div>
                    </div>
                `,
                text: `
                    SafeBite - New Contact Form Message
                    
                    Name: ${contactData.name}
                    Email: ${contactData.email}
                    
                    Message:
                    ${contactData.message}
                    
                    ---
                    This message was sent from the SafeBite contact form.
                    Reply directly to this email to respond to ${contactData.name}.
                    © 2024 SafeBite. All rights reserved.
                `,
                replyTo: contactData.email // Allow direct reply to the sender
            };

            const result = await this.transporter.sendMail(mailOptions);
            
            return { 
                success: true, 
                message: 'Contact form email sent successfully',
                messageId: result.messageId 
            };

        } catch (error) {
            return { 
                success: false, 
                message: 'Failed to send contact form email',
                error: error.message 
            };
        }
    }

    async sendSpoilageAlertEmail(email, userName = 'User', {
        foodName,
        alertLevel = 'Medium',
        alertType = 'spoilage',
        probability,
        recommendation,
        message,
        sensorReadings
    } = {}) {
        try {
            if (!this.transporter) {
                console.log(`📧 [DEV MODE] Spoilage alert email would be sent to: ${email}`);
                console.log({ foodName, alertLevel, alertType, probability, recommendation, message, sensorReadings });
                return { success: true, message: 'Spoilage alert logged to console (development mode)' };
            }

            const subject = `SafeBite • ${foodName ? foodName + ' • ' : ''}${String(alertLevel).toUpperCase()} Spoilage Risk`;
            const severityColor = alertLevel === 'High' ? '#dc3545' : (alertLevel === 'Medium' ? '#ffc107' : '#4a9eff');
            const statusEmoji = alertLevel === 'High' ? '🚨' : (alertLevel === 'Medium' ? '⚠️' : 'ℹ️');
            const frontendBase = process.env.FRONTEND_BASE_URL || 'https://safebiteph.com';
            const dashboardUrl = `${frontendBase.replace(/\/$/, '')}/user-dashboard`;

            const readingsHtml = sensorReadings ? `
                <ul style="color: #34495e; line-height: 1.6;">
                    ${sensorReadings.temperature !== undefined ? `<li>Temperature: <strong>${sensorReadings.temperature}°C</strong></li>` : ''}
                    ${sensorReadings.humidity !== undefined ? `<li>Humidity: <strong>${sensorReadings.humidity}%</strong></li>` : ''}
                    ${sensorReadings.gas_level !== undefined ? `<li>Gas Level: <strong>${sensorReadings.gas_level} ppm</strong></li>` : ''}
                </ul>
            ` : '';

            const mailOptions = {
                from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
                to: email,
                subject,
                html: `
                    <div style=\"font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; max-width: 680px; margin: 0 auto; padding: 24px; background: #f5f7fb;\">
                        <div style=\"background: #0f172a; color: #e2e8f0; border-radius: 16px; padding: 24px; text-align: center; margin-bottom: 16px;\">
                            <div style=\"font-size: 22px; font-weight: 800; letter-spacing: .2px;\">SafeBite</div>
                            <div style=\"opacity:.8; font-size: 13px; margin-top: 6px;\">Food Safety Monitoring</div>
                        </div>
                        <div style=\"background: #ffffff; padding: 24px; border-radius: 16px; border: 1px solid #e6e8ee; box-shadow: 0 1px 2px rgba(15, 23, 42, .04);\">
                            <h2 style=\"margin: 0 0 8px; color: #0f172a; font-size: 20px;\">${statusEmoji} ${alertLevel} spoilage risk detected</h2>
                            <p style=\"color: #334155; line-height: 1.6; margin: 0 0 12px;\">Hello ${userName},</p>
                            <p style=\"color: #334155; line-height: 1.6; margin: 0 0 12px;\">${message || 'Our sensors and models detected a potential spoilage risk.'}</p>
                            ${foodName ? `<p style=\\\"color:#0f172a; font-weight:600; margin: 0 0 12px;\\\">Food Item: ${foodName}</p>` : ''}
                            ${probability !== undefined ? `<p style=\\\"color:#334155; margin: 0 0 12px;\\\">Estimated Probability: <strong>${probability}%</strong></p>` : ''}
                            ${readingsHtml}
                            ${recommendation ? `<div style=\\\"margin-top: 12px; padding: 14px; background: #f8fafc; border-radius: 12px; border: 1px solid #e2e8f0;\\\">\n
                                <div style=\\\"color:#0f172a; font-weight:700; margin-bottom:6px;\\\">Recommended Action</div>\n                                
                                <div style=\\\"color:#334155;\\\">${recommendation}</div>\n                            
                                </div>` : ''}
                            <div style=\"margin-top: 18px;\">
                                <a href=\"${dashboardUrl}\" style=\"display:inline-block; background:${severityColor}; color:#0f172a; text-decoration:none; font-weight:700; padding: 10px 16px; border-radius: 10px; border: 1px solid rgba(15,23,42,.12);\">Open Dashboard</a>
                            </div>
                        </div>
                        <div style=\"text-align:center; color:#64748b; font-size:12px; margin-top: 12px;\">This is an automated notification from SafeBite.</div>
                    </div>
                `
            };

            const result = await this.transporter.sendMail(mailOptions);
            return { success: true, message: 'Spoilage alert email sent', messageId: result.messageId };
        } catch (error) {
            console.error('📧 Spoilage alert email failed:', error);
            return { success: false, message: 'Failed to send spoilage alert email', error: error.message };
        }
    }
}

module.exports = new EmailService();
