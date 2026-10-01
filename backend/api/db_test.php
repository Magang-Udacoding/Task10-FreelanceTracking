<?php
require_once '../config/database.php';

header('Content-Type: application/json');

if (isset($pdo)) {
    echo json_encode([
        'success' => true,
        'message' => 'Koneksi ke database XAMPP menggunakan .env BERHASIL!',
        'host' => $_ENV['DB_HOST'] ?? 'localhost',
        'database' => $_ENV['DB_NAME'] ?? 'db_omsets',
        'user' => $_ENV['DB_USER'] ?? 'root'
    ]);
} else {
    echo json_encode([
        'success' => false,
        'message' => 'Koneksi GAGAL. Periksa file .env Anda.'
    ]);
}
?>
