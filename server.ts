import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import nodemailer from "nodemailer";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // Support Email Endpoint
  app.post("/api/support", async (req, res) => {
    const { subject, category, message, userEmail, userName } = req.body;

    try {
      // Configure transporter
      // Note: User needs to provide these in .env
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
        res.json({ success: true, message: "Email sent successfully" });
      } else {
        // Fallback for demo if no password provided
        console.log("SMTP_PASS not provided. Email content:");
        console.log(mailOptions);
        res.json({ 
          success: true, 
          message: "Support request received (Demo Mode: Email logged to console. Please configure SMTP_PASS in settings for real emails.)" 
        });
      }
    } catch (error) {
      console.error("Error sending email:", error);
      res.status(500).json({ success: false, message: "Failed to send email" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
