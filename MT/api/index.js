const fetch = require('node-fetch');
const nodemailer = require('nodemailer');

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    try {
      const botToken = process.env.TELEGRAM_BOT_TOKEN;
      const chatId = process.env.TELEGRAM_CHAT_ID;
      const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;

      // Send message to Telegram
      const telegramResponse = await fetch(telegramUrl, {
        method: 'POST',
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const telegramData = await telegramResponse.json();

      if (!telegramResponse.ok) {
        return res.status(500).json({ error: telegramData.description });
      }

      // Send message to Discord webhook
      const discordWebhookUrl = process.env.DISCORD_WEBHOOK_URL;
      await fetch(discordWebhookUrl, {
        method: 'POST',
        body: JSON.stringify({
          content: message,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // Send email
      const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: process.env.EMAIL_SECURE === 'true', // true for 465, false for other ports
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: process.env.EMAIL_TO,
        subject: 'New Message Notification',
        text: message,
      });

      res.status(200).json({ success: true, message: 'Message sent to Telegram, Discord, and Email' });
    } catch (error) {
      res.status(500).json({ error: 'Error sending message', details: error.message });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
