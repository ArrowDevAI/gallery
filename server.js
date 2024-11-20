const express = require('express');
const nodemailer = require('nodemailer');
require('dotenv').config();  // Load environment variables from .env file

const app = express();
const port = process.env.PORT || 3000;

// Built-in middleware for parsing incoming request bodies
app.use(express.urlencoded({ extended: true }));  // For URL-encoded data (form submissions)
app.use(express.json());  // For parsing JSON data
// Default route to serve the homepage or provide basic feedback
app.get('/', (req, res) => {
  res.send('Welcome! The server is running. Use /send-email to send a message.');
});

// Route to handle form submission
app.post('/send-email', (req, res) => {
  const { name, email, message } = req.body;

  // Create a transporter using your email service (e.g., Gmail, Outlook, etc.)
  const transporter = nodemailer.createTransport({
    service: 'gmail',  // or your email provider
    auth: {
      user: process.env.EMAIL_USER, 
      pass: process.env.EMAIL_PASS   
    }
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,  
    to: 'higginst.th@gmail.com',  
    subject: 'Contact Form Submission',
    text: `You have a new message from ${name} (${email}):\n\n${message}`
  };

  // Send the email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      return res.status(500).send('Email failed to send');
    } else {
      console.log('Email sent: ' + info.response);
      return res.status(200).send('Email sent successfully');
    }
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
