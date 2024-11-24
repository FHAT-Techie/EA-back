const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

// Import routes
const paystackRoutes = require("./paystack"); // Paystack module
const contactRoutes = require("./contact"); // Contact form module

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

// Use imported routes
app.use(paystackRoutes); // Paystack verification routes
app.use(contactRoutes); // Contact and Partnership email routes

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
