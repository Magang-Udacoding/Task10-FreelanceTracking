<?php
require_once '../config/database.php';

if (!isset($_SESSION['user_id']) || $_SESSION['role'] !== 'admin') {
    echo json_encode(['success' => false, 'message' => 'Unauthorized - Admin only']);
    exit();
}

$data = json_decode(file_get_contents('php://input'), true);

if (isset($data['target_bulanan'])) {
    $stmt = $pdo->prepare("UPDATE settings SET setting_value = ? WHERE setting_key = 'target_bulanan'");
    $stmt->execute([$data['target_bulanan']]);
    echo json_encode(['success' => true, 'message' => 'Settings updated']);
} else {
    echo json_encode(['success' => false, 'message' => 'No settings to update']);
}
?>