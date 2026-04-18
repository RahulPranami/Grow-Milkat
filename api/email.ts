
import type { VercelRequest, VercelResponse } from '@vercel/node';
import nodemailer from "nodemailer";

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  const { type, payload } = req.body;

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_USER || 'growmilkat@gmail.com',
        pass: process.env.SMTP_PASS 
      }
    });

    let subject = '';
    let text = '';
    let html = '';

    switch (type) {
      case 'OTP':
        subject = `[Grow Milkat] Your Verification Code: ${payload.otp}`;
        text = `Your OTP for registration is ${payload.otp}. It expires in 10 minutes.`;
        break;
      case 'INVESTMENT_CERTIFICATE':
        subject = `[Grow Milkat] Investment Certificate - ${payload.opportunityTitle}`;
        text = `Congratulations! Your investment of ${payload.amount} in ${payload.opportunityTitle} is confirmed. Please find your certificate attached.`;
        break;
      case 'WITHDRAWAL':
        subject = `[Grow Milkat] Withdrawal Request - ${payload.status}`;
        text = `Your withdrawal request for ${payload.amount} has been ${payload.status.toLowerCase()}.`;
        break;
      case 'KYC':
        subject = `[Grow Milkat] KYC Verification - ${payload.status}`;
        text = `Your KYC verification status has been updated to: ${payload.status}. ${payload.reason ? `Reason: ${payload.reason}` : ''}`;
        break;
      case 'SUPPORT':
        subject = `[Support Request] ${payload.subject}`;
        text = `Category: ${payload.category}\nFrom: ${payload.userName} (${payload.userEmail})\n\nMessage:\n${payload.message}`;
        break;
      case 'NOTIFICATION':
        subject = `[Grow Milkat] New Notification: ${payload.title}`;
        text = payload.message;
        break;
      default:
        subject = `[Grow Milkat] Update`;
        text = payload.message;
    }

    const mailOptions = {
      from: process.env.SMTP_USER || 'growmilkat@gmail.com',
      to: payload.userEmail || 'growmilkat@gmail.com',
      subject: subject,
      text: text,
      html: html || `<p>${text}</p>`
    };

    if (process.env.SMTP_PASS) {
      await transporter.sendMail(mailOptions);
      return res.status(200).json({ success: true, message: "Email sent successfully" });
    } else {
      console.log(`SMTP_PASS missing. [${type}] would send to ${mailOptions.to}:`);
      console.log(mailOptions.text);
      return res.status(200).json({ 
        success: true, 
        message: "Email logged to console (Demo Mode)." 
      });
    }
  } catch (error) {
    console.error("Error sending email:", error);
    return res.status(500).json({ success: false, message: "Failed to send email" });
  }
}
