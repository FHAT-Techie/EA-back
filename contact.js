const express = require("express");
const nodemailer = require("nodemailer");
require("dotenv").config();

const router = express.Router();

// Nodemailer Transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // Your email address
    pass: process.env.EMAIL_PASS, // Your email password
  },
});

// **Contact Form Endpoint**
router.post("/send-contact-email", async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: "All fields are required." });
  }

  const mailOptions = {
    from: `"Contact Inquiry" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_USER,
    subject: "New Contact Form Submission",
    text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Message sent successfully." });
  } catch (error) {
    console.error("Error sending contact email:", error);
    res.status(500).json({ error: "Failed to send the message. Please try again." });
  }
});

// **Partnership Form Endpoint**
router.post("/send-partnership-email", async (req, res) => {
  const {
    partnerName,
    partnerEmail,
    partnerPhoneNumber,
    howWouldYouPartner,
  } = req.body;

  if (!partnerName || !partnerEmail || !partnerPhoneNumber || !howWouldYouPartner?.length) {
    return res.status(400).json({ error: "Required fields are missing." });
  }

  const emailContent = `
    Name: ${partnerName}
    Email: ${partnerEmail}
    Phone: ${partnerPhoneNumber}
    Partnership Type: ${howWouldYouPartner.join(", ")}
  `;

  const mailOptions = {
    from: `"Partnership Inquiry" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_USER,
    subject: "New Partnership Inquiry",
    text: emailContent,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Partnership inquiry submitted successfully." });
  } catch (error) {
    console.error("Error sending partnership email:", error);
    res.status(500).json({ error: "Failed to send the inquiry. Please try again." });
  }
});

module.exports = router;
