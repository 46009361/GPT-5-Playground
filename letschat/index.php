<?php
require_once('../auth/bearer.php');
// Read the raw JSON body sent to your original PHP endpoint
$rawBody = file_get_contents('php://input');

if ($rawBody === false) {
    http_response_code(400);
    echo json_encode(['error' => 'Failed to read request body']);
    exit;
}

// Initialize cURL to the Hack Club AI proxy endpoint
$ch = curl_init('https://ai.hackclub.com/proxy/v1/chat/completions');

curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST => true,
    CURLOPT_HTTPHEADER => [
        "Authorization: Bearer $HACKCLUB_AI_API_KEY";
        'Content-Type: application/json'
    ],
    CURLOPT_POSTFIELDS => $rawBody,
    CURLOPT_TIMEOUT => 30,
]);

$response = curl_exec($ch);

if ($response === false) {
    http_response_code(502);
    echo json_encode([
        'error' => 'Upstream request failed',
        'details' => curl_error($ch)
    ]);
    curl_close($ch);
    exit;
}

$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

// Forward upstream status code and response
http_response_code($httpCode);
header('Content-Type: application/json');
echo $response;
?>