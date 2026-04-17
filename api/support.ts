
import type { VercelRequest, VercelResponse } from '@vercel/node';
import nodemailer from "nodemailer";

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  const { subject, category, message, userEmail, userName } = req.body;

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_USER || 'growmilkat@gmail.com',
        pass: process.env.SMTP_PASS // App Password for Gmail
      }
    });

    const mailOptions = {
      from: process.env.SMTP_USER || 'growmilkat@gmail.com',
      to: 'growmilkat@gmail.com',
      subject: `[Support Request] ${subject}`,
      text: `
Category: ${category}
From: ${userName} (${userEmail})

Message:
${message}
      `
    };

    if (process.env.SMTP_PASS) {
      await transporter.sendMail(mailOptions);
      return res.status(200).json({ success: true, message: "Email sent successfully" });
    } else {
      console.log("SMTP_PASS not provided. Email content:");
      console.log(mailOptions);
      return res.status(200).json({ 
        success: true, 
        message: "Support request received (Demo Mode: Email logged to console. Please configure SMTP_PASS in settings for real emails.)" 
      });
    }
  } catch (error) {
    console.error("Error sending email:", error);
    return res.status(500).json({ success: false, message: "Failed to send email" });
  }
}
