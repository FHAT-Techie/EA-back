require('dotenv').config();
const express = require('express');
const axios = require('axios');

const router = express.Router();

// Retrieve Paystack secret key from environment variables
const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;

// Endpoint to verify payment
router.post('/verify-payment', async (req, res) => {
  const { reference } = req.body;

  if (!reference) {
    return res.status(400).json({ message: 'Payment reference is required.' });
  }

  try {
    // Verify payment with Paystack
    const response = await axios.get(`https://api.paystack.co/transaction/verify/${reference}`, {
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
      },
    });

    if (response.data.data.status === 'success') {
      // Payment successful
      console.log('Payment verified:', response.data);
      return res.status(200).json({ message: 'Payment verified', data: response.data });
    } else {
      // Payment verification failed
      return res.status(400).json({ message: 'Payment verification failed', data: response.data });
    }
  } catch (error) {
    console.error('Error verifying payment:', error.message);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
