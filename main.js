const express = require('express');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

const logFilePath = './temp/logs.txt';
const cacheDir = './cache';

if (!fs.existsSync(cacheDir)) {
  fs.mkdirSync(cacheDir);
}

if (!fs.existsSync(logFilePath)) {
  const headers = "IP,ISP,Type,Country,Timestamp\n";
  fs.writeFileSync(logFilePath, headers);
}

// Utility function to get client IP
function getClientIp(req) {
  const headers = req.headers;
  const ip = headers['x-forwarded-for'] || req.connection.remoteAddress;
  return ip;
}

// API Call Utility Function
const apiCalls = {
  proxy1: (ip) => `https://blackbox.ipinfo.app/lookup/${ip}`,
  proxy2: (ip) => `http://check.getipintel.net/check.php?ip=${ip}&contact=yourEmail${Math.floor(Math.random() * 99999999) + 1999999}@domain.com`,
  proxy3: (ip) => `https://ip.teoh.io/api/vpn/${ip}`,
  proxy4: (ip) => `http://proxycheck.io/v2/${ip}&risk=1&vpn=1`,
  proxy5: (ip) => `https://v2.api.iphub.info/guest/ip/${ip}`,
};

// Check if IP is a bot based on API results
async function checkIfBot(ip) {
  for (let proxy of Object.values(apiCalls)) {
    try {
      const response = await axios.get(proxy(ip));
      if (response.data === 'Y' || response.data >= 0.99) {
        return true;
      }
    } catch (error) {
      console.error('Error checking IP:', error.message);
    }
  }
  return false;
}

// Route for handling IP check
app.get('/', async (req, res) => {
  const ip = getClientIp(req);
  const cacheFile = path.join(cacheDir, `${ip}.txt`);
  
  let isBadIp = false;

  if (fs.existsSync(cacheFile) && (Date.now() - fs.statSync(cacheFile).mtimeMs < 3600000)) {
    isBadIp = fs.readFileSync(cacheFile, 'utf-8') === '1';
  } else {
    const isBot = await checkIfBot(ip);
    isBadIp = isBot;
    fs.writeFileSync(cacheFile, isBot ? '1' : '0');
  }

  // Log information about the visitor
  const logData = {
    ip: ip,
    timestamp: new Date().toISOString(),
    type: isBadIp ? 'bot' : 'human',
  };

  const logEntry = `${logData.ip},${logData.type},${logData.timestamp}\n`;
  fs.appendFileSync(logFilePath, logEntry);

  if (isBadIp) {
    res.status(403).send('Access Denied: We don’t accept people from your location or VPN. Please try later or disable any VPN if you are using one!');
  } else {
    res.redirect('/MT');
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
