const fetch = require('node-fetch'); // Make sure node-fetch is installed

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    try {
      const botToken = '7558491921:AAHUTukOw29luISZHlTCiEUrPaqcQEwjrAg';
      const chatId = '7296145278';
      const url = `https://api.telegram.org/bot${botToken}/sendMessage`;

      const response = await fetch(url, {
        method: 'POST',
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        return res.status(500).json({ error: data.description });
      }

      res.status(200).json({ success: true, data });
    } catch (error) {
      res.status(500).json({ error: 'Error sending message to Telegram', details: error.message });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
