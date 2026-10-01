<?php
require_once '../config/database.php';

// Check if user is logged in
if (isset($_SESSION['user_id'])) {
    // Unset all session variables
    $_SESSION = array();

    // Destroy the session cookie if it exists
    if (ini_get("session.use_cookies")) {
        $params = session_get_cookie_params();
        setcookie(session_name(), '', time() - 42000,
            $params["path"], $params["domain"],
            $params["secure"], $params["httponly"]
        );
    }

    // Destroy the session
    session_destroy();
    
    echo json_encode(['success' => true, 'message' => 'Berhasil logout']);
} else {
    echo json_encode(['success' => true, 'message' => 'Sudah logout']);
}
?>
