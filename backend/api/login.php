<?php
require_once '../config/database.php';

error_reporting(E_ALL);
ini_set('display_errors', 1);

$data = json_decode(file_get_contents('php://input'), true);

if (!$data || !isset($data['email']) || !isset($data['password'])) {
    echo json_encode(['success' => false, 'message' => 'Email and password required']);
    exit();
}

$email = trim($data['email']);
$password = $data['password'];

$stmt = $pdo->prepare("SELECT id, username, email, password, role FROM users WHERE email = :email OR username = :username");
$stmt->execute(['email' => $email, 'username' => $email]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);

if ($user) {
    if (password_verify($password, $user['password'])) {
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['username'] = $user['username'];
        $_SESSION['role'] = $user['role'];
        $_SESSION['logged_in'] = true;
        
        echo json_encode([
            'success' => true,
            'user' => [
                'id' => $user['id'],
                'username' => $user['username'],
                'email' => $user['email'],
                'role' => $user['role']
            ]
        ]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Wrong password']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'User not found']);
}
?>