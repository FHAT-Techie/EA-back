const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const nodemailer = require("nodemailer");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Rate Limiter to prevent abuse
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per window
  message: { error: "Too many requests. Please try again later." },
});
app.use(limiter);

// Nodemailer Transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // Your email address (via environment variable)
    pass: process.env.EMAIL_PASS, // Your email password (via environment variable)
  },
});

// **Contact Form Endpoint**
app.post("/send-contact-email", async (req, res) => {
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
    console.log("Contact email sent: ", info.response);
    res.status(200).json({ message: "Message sent successfully." });
  } catch (error) {
    console.error("Error sending contact email:", error);
    res.status(500).json({ error: "Failed to send the message. Please try again." });
  }
});

// **Partnership Form Endpoint**
app.post("/send-partnership-email", async (req, res) => {
  const {
    partnerName,
    partnerEmail,
    partnerPhoneNumber,
    partnerOrganizationName,
    partnerOrganizationWebsite,
    partnerOrganizationType,
    otherOrganizationType,
    howWouldYouPartner,
    otherHowWouldYouPartner,
    partnershipIdea,
    howDidYouHearAboutUs,
    additionalCommentOrQuestion,
    communicationAgreement,
  } = req.body;

  if (!partnerName || !partnerEmail || !partnerPhoneNumber || !howWouldYouPartner?.length) {
    return res.status(400).json({ error: "Required fields are missing." });
  }

  const emailContent = `
    Name: ${partnerName}
    Email: ${partnerEmail}
    Phone: ${partnerPhoneNumber}
    Organization Name: ${partnerOrganizationName || "N/A"}
    Organization Website: ${partnerOrganizationWebsite || "N/A"}
    Organization Type: ${partnerOrganizationType || otherOrganizationType || "N/A"}
    Partnership Type: ${howWouldYouPartner.join(", ")}
    Other Partnership Type: ${otherHowWouldYouPartner || "N/A"}
    Partnership Idea: ${partnershipIdea || "N/A"}
    How Did You Hear About Us: ${howDidYouHearAboutUs || "N/A"}
    Additional Comment: ${additionalCommentOrQuestion || "N/A"}
    Communication Agreement: ${communicationAgreement ? "Agreed" : "Not Agreed"}
  `;

  const mailOptions = {
    from: `"Partnership Inquiry" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_USER,
    subject: "New Partnership Inquiry",
    text: emailContent,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Partnership email sent: ", info.response);
    res.status(200).json({ message: "Partnership inquiry submitted successfully." });
  } catch (error) {
    console.error("Error sending partnership email:", error);
    res.status(500).json({ error: "Failed to send the inquiry. Please try again." });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

