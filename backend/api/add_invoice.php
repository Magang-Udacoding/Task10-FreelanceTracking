<?php
require_once '../config/database.php';

if (!isset($_SESSION['user_id']) || $_SESSION['role'] !== 'admin') {
    echo json_encode(['success' => false, 'message' => 'Unauthorized - Admin only']);
    exit();
}

$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['project_name']) || !isset($data['client']) || !isset($data['amount']) || !isset($data['date'])) {
    echo json_encode(['success' => false, 'message' => 'Missing required fields']);
    exit();
}

// Validasi amount
$amount = str_replace(',', '', $data['amount']);
$amount = floatval($amount);

// Begin Transaction to ensure both tables are updated or neither is
$pdo->beginTransaction();

try {
    // 1. Insert into invoices table (for finance/chart statistics)
    $stmt = $pdo->prepare("INSERT INTO invoices (project_name, client, amount, date, status, created_by) VALUES (?, ?, ?, ?, ?, ?)");
    $stmt->execute([
        $data['project_name'],
        $data['client'],
        $amount,
        $data['date'],
        $data['status'] ?? 'pending',
        $_SESSION['user_id']
    ]);
    
    // Map status for projects table
    $statusMap = [
        'paid' => 'completed',
        'pending' => 'pending',
        'overdue' => 'on-hold',
        'completed' => 'completed',
        'on-hold' => 'on-hold'
    ];
    $projStatus = $statusMap[$data['status']] ?? 'pending';

    // 2. Insert into projects table (for the main data grid)
    $stmtProj = $pdo->prepare("INSERT INTO projects (name, client, revenue, hours, status, priority, start_date, end_date, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
    $stmtProj->execute([
        $data['project_name'],
        $data['client'],
        $amount,
        $data['hours'] ?? 0,
        $projStatus,
        $data['priority'] ?? 'medium',
        $data['start_date'] ?? $data['date'],
        $data['end_date'] ?? $data['date'],
        $_SESSION['user_id']
    ]);

    $pdo->commit();
    echo json_encode(['success' => true, 'message' => 'Invoice dan Proyek berhasil disimpan ke database!', 'id' => $pdo->lastInsertId()]);
} catch (Exception $e) {
    $pdo->rollBack();
    echo json_encode(['success' => false, 'message' => 'Gagal menyimpan ke database: ' . $e->getMessage()]);
}
?>