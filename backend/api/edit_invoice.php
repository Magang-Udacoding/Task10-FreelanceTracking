<?php
require_once '../config/database.php';

if (!isset($_SESSION['user_id']) || $_SESSION['role'] !== 'admin') {
    echo json_encode(['success' => false, 'message' => 'Unauthorized - Admin only']);
    exit();
}

$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['id'])) {
    echo json_encode(['success' => false, 'message' => 'ID required']);
    exit();
}

// 1. Coba cari di tabel projects terlebih dahulu (karena frontend memfilter data projects)
$stmtFetch = $pdo->prepare("SELECT name, client FROM projects WHERE id = ?");
$stmtFetch->execute([$data['id']]);
$oldProject = $stmtFetch->fetch(PDO::FETCH_ASSOC);

if ($oldProject) {
    $pdo->beginTransaction();
    try {
        // Map status for projects table
        $statusMap = [
            'paid' => 'completed',
            'pending' => 'pending',
            'overdue' => 'on-hold',
            'completed' => 'completed',
            'on-hold' => 'on-hold'
        ];
        $projStatus = $statusMap[$data['status']] ?? 'pending';
        
        $invoiceStatus = ($data['status'] === 'completed' || $data['status'] === 'paid') ? 'paid' : (($data['status'] === 'on-hold' || $data['status'] === 'overdue') ? 'overdue' : 'pending');

        // Update projects by ID
        $stmt1 = $pdo->prepare("UPDATE projects SET name = ?, client = ?, revenue = ?, status = ? WHERE id = ?");
        $stmt1->execute([
            $data['project_name'],
            $data['client'],
            $data['amount'],
            $projStatus,
            $data['id']
        ]);

        // Update invoices by name and client to keep in sync
        $stmt2 = $pdo->prepare("UPDATE invoices SET project_name = ?, client = ?, amount = ?, status = ? WHERE project_name = ? AND client = ?");
        $stmt2->execute([
            $data['project_name'],
            $data['client'],
            $data['amount'],
            $invoiceStatus,
            $oldProject['name'],
            $oldProject['client']
        ]);

        $pdo->commit();
        echo json_encode(['success' => true, 'message' => 'Proyek dan Invoice berhasil diperbarui!']);
    } catch (Exception $e) {
        $pdo->rollBack();
        echo json_encode(['success' => false, 'message' => 'Gagal memperbarui di database: ' . $e->getMessage()]);
    }
} else {
    // 2. Fallback: Cari di tabel invoices (jika ID yang dikirim adalah ID invoice)
    $stmtFetchInv = $pdo->prepare("SELECT project_name, client FROM invoices WHERE id = ?");
    $stmtFetchInv->execute([$data['id']]);
    $oldInvoice = $stmtFetchInv->fetch(PDO::FETCH_ASSOC);
    
    if ($oldInvoice) {
        $pdo->beginTransaction();
        try {
            $invoiceStatus = ($data['status'] === 'completed' || $data['status'] === 'paid') ? 'paid' : (($data['status'] === 'on-hold' || $data['status'] === 'overdue') ? 'overdue' : 'pending');
            $projStatus = ($data['status'] === 'completed' || $data['status'] === 'paid') ? 'completed' : (($data['status'] === 'on-hold' || $data['status'] === 'overdue') ? 'on-hold' : 'pending');
            
            // Update invoices by ID
            $stmt1 = $pdo->prepare("UPDATE invoices SET project_name = ?, client = ?, amount = ?, status = ? WHERE id = ?");
            $stmt1->execute([
                $data['project_name'],
                $data['client'],
                $data['amount'],
                $invoiceStatus,
                $data['id']
            ]);
            
            // Update projects by name and client to keep in sync
            $stmt2 = $pdo->prepare("UPDATE projects SET name = ?, client = ?, revenue = ?, status = ? WHERE name = ? AND client = ?");
            $stmt2->execute([
                $data['project_name'],
                $data['client'],
                $data['amount'],
                $projStatus,
                $oldInvoice['project_name'],
                $oldInvoice['client']
            ]);
            
            $pdo->commit();
            echo json_encode(['success' => true, 'message' => 'Invoice dan Proyek berhasil diperbarui!']);
        } catch (Exception $e) {
            $pdo->rollBack();
            echo json_encode(['success' => false, 'message' => 'Gagal memperbarui di database: ' . $e->getMessage()]);
        }
    } else {
        echo json_encode(['success' => false, 'message' => 'Data tidak ditemukan di database.']);
    }
}
?>