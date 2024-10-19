<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
session_start(); // Start the session

// Include the database connection
include 'connection.inc.php';

// Read the input JSON data
$input = file_get_contents("php://input");
$data = json_decode($input, true);

if ($data === null) {
    echo json_encode(['success' => false, 'message' => 'Invalid input data.']);
    exit;
}

// Extract username and password from the data
$username = isset($data['idNumber']) ? $data['idNumber'] : null;
$password = isset($data['password']) ? $data['password'] : null;

if (!$username || !$password) {
    echo json_encode(['success' => false, 'message' => 'Missing username or password.']);
    exit;
}

// Query to validate the user by username
$sql = "SELECT * FROM tbl_employee WHERE username = :username";
$stmt = $conn->prepare($sql);
$stmt->bindParam(':username', $username);
$stmt->execute();
$result = $stmt->fetch(PDO::FETCH_ASSOC);

if ($result && password_verify($password, $result['password'])) {
    // Determine role
    $role = $result['department_id'] == 2 ? 'admin' : 'employee';

    // Set session variables
    $_SESSION['logged_in'] = true;
    $_SESSION['employee_id'] = $result['employee_id']; // Ensure this is set
    $_SESSION['role'] = $role;

    // Log session info
    error_log("Session employee_id set: " . $_SESSION['employee_id']);

    echo json_encode(['success' => true, 'role' => $role]);
} else {
    // Invalid credentials
    echo json_encode(['success' => false, 'message' => 'Invalid credentials.']);
}
?>
