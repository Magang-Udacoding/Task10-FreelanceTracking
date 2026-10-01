<?php
require_once '../config/database.php';

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['error' => 'Unauthorized']);
    exit();
}

$format = $_GET['format'] ?? 'csv';
$stmt = $pdo->query("SELECT * FROM invoices ORDER BY date DESC");
$invoices = $stmt->fetchAll(PDO::FETCH_ASSOC);

if ($format === 'csv') {
    header('Content-Type: text/csv');
    header('Content-Disposition: attachment; filename="invoices_export.csv"');
    
    $output = fopen('php://output', 'w');
    fputcsv($output, ['ID', 'Project Name', 'Client', 'Amount', 'Date', 'Status']);
    
    foreach ($invoices as $invoice) {
        fputcsv($output, [
            $invoice['id'],
            $invoice['project_name'],
            $invoice['client'],
            $invoice['amount'],
            $invoice['date'],
            $invoice['status']
        ]);
    }
    fclose($output);
} elseif ($format === 'excel') {
    header('Content-Type: application/vnd.ms-excel');
    header('Content-Disposition: attachment; filename="invoices_export.xls"');
    
    echo "<table border='1'>";
    echo "<tr><th>ID</th><th>Project Name</th><th>Client</th><th>Amount</th><th>Date</th><th>Status</th></tr>";
    foreach ($invoices as $invoice) {
        echo "<tr>";
        echo "<td>{$invoice['id']}</td>";
        echo "<td>{$invoice['project_name']}</td>";
        echo "<td>{$invoice['client']}</td>";
        echo "<td>{$invoice['amount']}</td>";
        echo "<td>{$invoice['date']}</td>";
        echo "<td>{$invoice['status']}</td>";
        echo "</tr>";
    }
    echo "</table>";
}
?>