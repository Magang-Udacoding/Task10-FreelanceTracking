<?php
require_once '../config/database.php';

if (!isset($_SESSION['user_id']) || $_SESSION['role'] !== 'admin') {
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    exit();
}

$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['user_id']) || !isset($data['new_role'])) {
    echo json_encode(['success' => false, 'message' => 'Missing parameters']);
    exit();
}

$target_user_id = $data['user_id'];
$new_role = $data['new_role'];

if (!in_array($new_role, ['admin', 'staff'])) {
    echo json_encode(['success' => false, 'message' => 'Invalid role']);
    exit();
}

try {
    $stmt = $pdo->prepare("UPDATE users SET role = ? WHERE id = ?");
    $result = $stmt->execute([$new_role, $target_user_id]);
    
    if ($result) {
        echo json_encode(['success' => true, 'message' => 'Role updated successfully']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to update role']);
    }
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Database error']);
}
?>
