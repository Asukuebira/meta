import fetch from 'node-fetch';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { message } = req.body;

    // Check if message is not empty
    if (!message || message.trim() === '') {
      return res.status(400).json({ error: 'Message cannot be empty' });
    }

    try {
      const response = await fetch('https://api.telegram.org/bot7558491921:AAHUTukOw29luISZHlTCiEUrPaqcQEwjrAg/sendMessage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: '7296145278',
          text: message,  // Send the validated message
        }),
      });

      const data = await response.json();

      if (response.ok) {
        res.status(200).json({ message: 'Message sent to Telegram' });
      } else {
        throw new Error(data.description);
      }
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Internal Server Error', message: error.message });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
