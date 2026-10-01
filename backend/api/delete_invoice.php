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
$project = $stmtFetch->fetch(PDO::FETCH_ASSOC);

if ($project) {
    $pdo->beginTransaction();
    try {
        // Hapus dari projects berdasarkan ID
        $stmt1 = $pdo->prepare("DELETE FROM projects WHERE id = ?");
        $stmt1->execute([$data['id']]);

        // Hapus dari invoices yang sesuai (berdasarkan nama dan klien)
        $stmt2 = $pdo->prepare("DELETE FROM invoices WHERE project_name = ? AND client = ?");
        $stmt2->execute([$project['name'], $project['client']]);

        $pdo->commit();
        echo json_encode(['success' => true, 'message' => 'Proyek dan Invoice berhasil dihapus!']);
    } catch (Exception $e) {
        $pdo->rollBack();
        echo json_encode(['success' => false, 'message' => 'Gagal menghapus dari database: ' . $e->getMessage()]);
    }
} else {
    // 2. Fallback: Cari di tabel invoices (jika ID yang dikirim adalah ID invoice)
    $stmtFetchInv = $pdo->prepare("SELECT project_name, client FROM invoices WHERE id = ?");
    $stmtFetchInv->execute([$data['id']]);
    $invoice = $stmtFetchInv->fetch(PDO::FETCH_ASSOC);
    
    if ($invoice) {
        $pdo->beginTransaction();
        try {
            // Hapus dari invoices berdasarkan ID
            $stmt1 = $pdo->prepare("DELETE FROM invoices WHERE id = ?");
            $stmt1->execute([$data['id']]);
            
            // Hapus dari projects yang sesuai (berdasarkan nama dan klien)
            $stmt2 = $pdo->prepare("DELETE FROM projects WHERE name = ? AND client = ?");
            $stmt2->execute([$invoice['project_name'], $invoice['client']]);
            
            $pdo->commit();
            echo json_encode(['success' => true, 'message' => 'Invoice dan Proyek berhasil dihapus!']);
        } catch (Exception $e) {
            $pdo->rollBack();
            echo json_encode(['success' => false, 'message' => 'Gagal menghapus dari database: ' . $e->getMessage()]);
        }
    } else {
        echo json_encode(['success' => false, 'message' => 'Data tidak ditemukan di database.']);
    }
}
?>