<?php
header('Content-Type: text/html; charset=utf-8');

// Load environment variables
if (file_exists('.env')) {
    $lines = file('.env', FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        if (strpos(trim($line), '#') === 0) continue;
        list($name, $value) = explode('=', $line, 2);
        putenv(trim($name) . '=' . trim($value));
    }
}

// Enable CORS
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Origin, Content-Type, Accept, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Simple routing
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$method = $_SERVER['REQUEST_METHOD'];

// Serve static files
if ($path === '/') {
    include __DIR__ . '/static/index.html';
    exit;
}

// API routes
if ($method === 'POST' && $path === '/api/v1/payouts') {
    require_once 'payouts.php';
    createPayout();
    exit;
}

// 404 Not Found
http_response_code(404);
echo json_encode(['error' => 'Not Found']);
?>