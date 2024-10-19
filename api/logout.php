<?php
session_start();
session_destroy(); // Destroy all session data

echo json_encode(['success' => true, 'message' => 'Logged out successfully.']);
?>
