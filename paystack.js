
const express = require("express");
const axios = require("axios");
require("dotenv").config();

const app = express();
app.use(express.json());

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;

// Verify Payment Endpoint
app.post("/verify-payment", async (req, res) => {
  const { reference } = req.body;

  if (!reference) {
    return res.status(400).json({ error: "Transaction reference is required." });
  }

  try {
    const response = await axios.get(`https://api.paystack.co/transaction/verify/${reference}`, {
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
      },
    });

    const { data } = response;
    if (data.status) {
      // Payment was successful
      return res.status(200).json({
        message: "Payment verified successfully.",
        transaction: data.data,
      });
    } else {
      // Payment verification failed
      return res.status(400).json({ error: "Payment verification failed." });
    }
  } catch (error) {
    console.error("Error verifying payment:", error.message);
    res.status(500).json({ error: "An error occurred while verifying payment." });
  }
});

// Server Listener
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
