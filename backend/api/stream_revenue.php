<?php
require_once '../config/database.php';

header('Content-Type: text/event-stream');
header('Cache-Control: no-cache');
header('Connection: keep-alive');

// Turn off output buffering
if (function_exists('ob_end_clean')) {
    @ob_end_clean();
}
ini_set('output_buffering', 'off');
ini_set('zlib.output_compression', false);

// Send retry parameter to client (reconnect after 5 seconds)
echo "retry: 5000\n";

try {
    // Query total revenue (omset)
    $stmt = $pdo->prepare("SELECT COALESCE(SUM(revenue), 0) as total FROM projects");
    $stmt->execute();
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    $revenue = (float)$row['total'];

    // Stream revenue updates
    echo "data: " . json_encode([
        'revenue' => $revenue,
        'timestamp' => time(),
        'status' => 'online'
    ]) . "\n\n";

} catch (Exception $e) {
    echo "data: " . json_encode([
        'error' => $e->getMessage(),
        'status' => 'error'
    ]) . "\n\n";
}

@ob_flush();
@flush();
?>
